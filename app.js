import dotenv from "dotenv";
import express from "express";
import data from "./data.js";
import LocalStrategy from "passport-local";
import passport from "passport";
import createUser from "./controllers/createUser.js";
import User from "./models/User.js";
import session from "express-session";
import connectDB from "./db/index.js";
import Blog from "./models/Blog.js";
import getPosts from "./controllers/getPosts.js";
import createBlog from "./controllers/createBlog.js";
import { ObjectId } from "mongodb";
import ejs from "ejs";

dotenv.config();

const app = express();
app.set("view engine", "ejs");
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

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.session());
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new LocalStrategy(async function (username, password, done) {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false);
    }
    if (user.password !== password) {
      return done(null, false);
    }
    return done(null, user);
  }),
);

let aboutContent = data.aboutContent;
let contactContent = data.contactContent;
let allPosts = [];

//getting posts from the database.

//get requests

app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    try {
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  } else {
    res.render("login");
  }
});

app.get("/register", (req, res) => {
  if (req.isAuthenticated()) {
    try {
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  } else {
    res.render("register");
  }
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return;
    }
    res.redirect("/login");
  });
});

app.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    await getPosts(req.user.id).then((allPosts) => {
      res.render("home", {
        allPost: allPosts,
      });
    });
  } else {
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
    passport.authenticate("local")(req, res, function () {
      res.redirect("/");
    });
  };
  createUser(req.body.username, req.body.email, req.body.password, callback);
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/register" }),
  (req, res) => {
    res.redirect("/");
  },
);
//listening
