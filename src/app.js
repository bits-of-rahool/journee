import express from "express";
import data from "./data.js";
import createUser from "./controllers/createUser.js";
import { User } from "./models/User.js";
import getPosts from "./controllers/getPosts.js";
import createBlog from "./controllers/createBlog.js";
// import { ObjectId } from "mongodb";
import ejs from "ejs";
import wrapper from "./utils/wrapper.js";

const app = express();
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let aboutContent = data.aboutContent;
let contactContent = data.contactContent;
let allPosts = [];

import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";

app.use("/user/", userRouter);
app.use("/journal/", blogRouter);

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
      allPost: allPosts,
    });
  });
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
    } else {
      res.redirect("/");
    }
  };
  wrapper(createUser)(
    req.body.username,
    req.body.email,
    req.body.password,
    callback,
  );
  // createUser(req.body.username, req.body.email, req.body.password, callback);
});

export { app };
