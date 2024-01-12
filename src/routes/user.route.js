import { Router } from "express";
import {createUser,loginUser} from "../controllers/createUser.js";
import verifyToken from "../middlewares/auth.js";
import { User } from "../models/User.js";
const router = Router();
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId


//login route
router
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post(loginUser);


//register route
router
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(createUser);

  //logout route
  router.post("/logout",verifyToken, async (req, res) => {
    const id = new ObjectId(req.user.id);
    const user = await User.findOneAndUpdate({_id:id},{refreshToken:null});
    res.clearCookie("accessToken").clearCookie("refreshToken").redirect("/user/login");
  }
  );

export default router;
 