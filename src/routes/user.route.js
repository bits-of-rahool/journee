import { Router } from "express";
import createUser from "../controllers/createUser.js";
import verifyUser from "../controllers/verifyUser.js";

const router = Router();

//login route
router
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post(verifyUser);


//register route
router
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(createUser);

  //logout route
  router.get("/logout", (req, res) => {
    res.redirect("/login");    
  })




export default router;
 