//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const data = require(__dirname + "/data.js");
var lodash = require("lodash");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const LocalStrategy  = require("passport-local");
const passport = require("passport");
const createUser = require("./model/mongoose");
const Users = require("./model/Users");
const session = require("express-session");
var ObjectId = require('mongodb').ObjectId; 


const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect(process.env.MONGO_URI);

app.use(session({
  secret:"Our little secret.",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.session());
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

const blogSchema = {
  title: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  uid: String,
};
const Blogs = mongoose.model("Blog", blogSchema);

passport.use(new LocalStrategy(
 async function(username, password, done) {
   const user = await Users.findOne({ username: username });
    if (!user) { return done(null, false); }
    if (user.password !== password) { return done(null, false); }
    return done(null, user);

  }
));

var homeStartingContent = data.homeStartingContent;
let aboutContent = data.aboutContent;
let contactContent = data.contactContent;
var allPost = [];
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

//getting posts from the database.


//get requests




app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/logout", (req, res) => {
  req.logout(function(err) {
    
    if (err) { return; }
    res.redirect('/login');
  });
})


app.post("/login", passport.authenticate("local", {failureRedirect:"/register"}),(req,res) => {

  res.redirect("/");
})



app.post("/register",  (req, res) => {

  const callback = function () {
    res.redirect("/");
  };
  createUser(req.body.username,req.body.email,req.body.password,callback);
}
);


app.get("/", (req, res) => {
 
  const getPosts = async function (callback) {

 
    try {
      const res = await Blogs.find({uid: req.user.id});
      allPost = [...res];
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    callback();
  };
  
  const render = function () {
    res.render("home", {
      homeContent: homeStartingContent,
      allPost: allPost,
    });
  };
  if(req.isAuthenticated()){
    getPosts(render);
  }
  else{
    res.redirect("/login");
  }
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/:para", async (req, res) => {
  const prm = lodash.lowerCase(req.params.para);
  allPost.forEach((elem) => {
    const title = lodash.lowerCase(elem.title);
    if (title === prm) {
      res.render("post", { title: elem.title, post: elem.post });
    }
  });
});
app.get("/:para/delete", async (req, res) => {
  const found = await Blogs.findOne({ title: req.params.para });
  await Blogs.findById(found._id).deleteOne();
  res.redirect("/");
});

// post requests
app.post("/compose", async (req, res) => {
  const today = new Date().toLocaleDateString("en-IN", options);
  

  const newPost = {
    title: req.body.title,
    post: req.body.post,
    date: today,
    uid: req.user.id
  };

  const newBlog = new Blogs(newPost);
  try {
    await newBlog.save();
    allPost.push(newPost);
    res.redirect("/"); //saving new document to DB
  } catch (error) {
    res.send(error.message);
  }
});

//listening
app.listen(3000, function () {
  console.log("Server started at http://localhost:3000");
});
