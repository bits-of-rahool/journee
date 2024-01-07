import dotenv from "dotenv";
import express from "express";
import data from "./data.js";
import createUser from "./controllers/createUser.js";
import {User} from "./models/User.js";
import connectDB from "./db/index.js";
import Blog from "./models/Blog.js";
import getPosts from "./controllers/getPosts.js";
import createBlog from "./controllers/createBlog.js";
import { ObjectId } from "mongodb";
import ejs from "ejs";
import wrapper from "./utils/wrapper.js";
dotenv.config();

const app = express();
app.set("view engine", "ejs");
app.set("views", "./src/views"); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

connectDB()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`server is listening on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => console.log(err));




let aboutContent = data.aboutContent;
let contactContent = data.contactContent;
let allPosts = [];

//getting posts from the database.

//get requests

app.get("/login", (req, res) => {
  
    res.render("login");
 
});

app.get("/register", (req, res) => {
 
    res.render("register");

});

app.get("/logout", (req, res) => {
    res.redirect("/login");
});

app.get("/", async (req, res) => {
  await getPosts().then((result) => {
    allPosts = [...result];
      res.render("home", {
        allPost: allPosts});
      })
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
  await Blog.findOne({ title: req.params.para }).then((found) => {
    res.render("post", { title: found.title, post: found.post });
  });
});

app.get("/:para/delete", async (req, res) => {
  await Blog.findOne({ title: req.params.para })
    .deleteOne()
    .then(() => {
      res.redirect("/");
    });
});
  
// post requests
app.post("/compose", async (req, res) => {
  await createBlog(req, res).then((newPost) => {
    allPosts.push(newPost);
    res.redirect("/");
  });
});

app.post("/register", (req, res) => {
  const callback = function (err) {
    if (err) {
      console.log(err);
    }
    else{
      res.redirect("/");
    }
  };
  wrapper(createUser)(req.body.username, req.body.email, req.body.password, callback);
  // createUser(req.body.username, req.body.email, req.body.password, callback);
});

app.post("/login",async (req, res) =>{
  try {
    const found = await User.findOne({ username: req.body.username });

    if (!found) {
      throw new Error('User not found');
    }
    const isPasswordMatch = await found.comparePassword(req.body.password);
    const token = await found.generateAccessToken();
    console.log(token)

    if (isPasswordMatch) {
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.redirect("/login");
  }
});
