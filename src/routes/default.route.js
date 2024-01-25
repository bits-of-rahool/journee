import { Router } from "express";
import {getJournal} from "../controllers/journal.controller.js";

const router = Router();


 
router.route("/").get(async (req, res) => {  
    await getJournal(req,res).then((result) => {
       const allPosts = [...result];
        res.render("home", {
          allPost: allPosts,
          avatar: req.user.avatar,
        });
    });
})



export default router