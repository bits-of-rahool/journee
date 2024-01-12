import { Router } from "express";
import getPosts from "../controllers/getPosts.js";
import data from "../data.js";


const router = Router();

let aboutContent = data.aboutContent; 
let contactContent = data.contactContent;
let allPosts = [];

router.route("/").get(async (req, res) => {  
    await getPosts().then((result) => {
        allPosts = [...result];
        console.log(req.user)
        res.render("home", {
          allPost: allPosts,
        });
    });
})

router.route("/about").get((req, res) => {
    res.render("about", { aboutContent: aboutContent });

})
router.route("/contact").get((req, res) => {
    res.render("contact", { contactContent: contactContent });

})

export default router