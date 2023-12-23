//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const data =require(__dirname+"/data.js")
var lodash = require('lodash');
const mongoose = require("mongoose");
const dotenv =require("dotenv").config();


const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect(process.env.MONGO_URI)


const schema={
  title: String,
  post: String
}
const Blogs = mongoose.model("Blog",schema);
let firstRun=true;
let allPost=[];

const getPosts = async function()  {
  try {
      const res = await Blogs.find({});
       allPost = [...res];
      // console.log(allPost)
  } catch (error) {
      console.error("Error fetching posts:", error);
  }
};





let homeStartingContent=data.homeStartingContent;
let aboutContent=data.aboutContent;
let contactContent=data.contactContent;
 

app.get("/", (req, res) => {
 
  getPosts();
  if(firstRun){
    setTimeout(() => {
      res.render("home", {
        homeContent: homeStartingContent,
        allPost:allPost
      });
    }, 1000);
    firstRun=false;
  }
  else{
    setTimeout(() => {
      res.render("home", {
        homeContent: homeStartingContent,
        allPost:allPost
      });
    }, 100);
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

app.get("/:para",(req,res)=>{
  const prm=lodash.lowerCase(req.params.para);
  // console.log(prm);
    
  allPost.forEach((elem)=>{
    const title=lodash.lowerCase(elem.title);
    if(title===prm){
      res.render("post",{title:elem.title,post:elem.post});
    }
    
  })

})

// post requests

app.post("/compose",(req,res)=>{
  const newPost={
    title:req.body.title,
    post:req.body.post
  };

  const newBlog= new Blogs(newPost);
  newBlog.save();
  allPost.push(newPost);

  res.redirect("/");
})



//listening
app.listen(3000,"localhost", function () {
  console.log("Server started at http://localhost:3000");
});

