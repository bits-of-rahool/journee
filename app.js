//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const data = require(__dirname + "/data.js");
var lodash = require("lodash");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect(process.env.MONGO_URI);

const schema = {
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
};
const Blogs = mongoose.model("Blog", schema);

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
const getPosts = async function (callback) {
  try {
    const res = await Blogs.find({});
    allPost = [...res];
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
  callback();
};

//get requests
app.get("/", (req, res) => {
  const render = function () {
    res.render("home", {
      homeContent: homeStartingContent,
      allPost: allPost,
    });
  };
  getPosts(render);
  //render function as callback
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
  console.log(today);

  const newPost = {
    title: req.body.title,
    post: req.body.post,
    date: today,
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
