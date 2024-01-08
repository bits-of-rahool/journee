import { Router } from "express";
import Blog from "../models/Blog.js";

const router = Router();

router.route("/:param").get(async (req, res) => {
  await Blog.findOne({ title: req.params.param }).then((found) => {
    res.render("post", { title: found.title, post: found.post });
  });
});

router.route("/:param/delete").get(async (req, res) => {
  await Blog.findOne({ title: req.params.param })
    .deleteOne()
    .then(() => {
      res.redirect("/");
    });
});

export default router;
