import { Router } from "express";
import { User } from "../models/User.js";
const router = Router();

router
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post(async (req, res) => {
    try {
      const found = await User.findOne({ username: req.body.username });

      if (!found) {
        throw new Error("User not found");
      }
      const isPasswordMatch = await found.comparePassword(req.body.password);

      if (isPasswordMatch) {
        res.redirect("/");
      } else {
        console.log("passn't");
        res.redirect("/user/login");
      }
    } catch (error) {
      console.error(error);
      res.redirect("/user/login");
    }
  });

export default router;
