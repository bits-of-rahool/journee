//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const data =require(__dirname+"/data.js")
var lodash = require('lodash');


const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));




let allPost=[];
let homeStartingContent=data.homeStartingContent;
let aboutContent=data.aboutContent;
let contactContent=data.contactContent;



app.get("/", (req, res) => {
  console.log(allPost)
  res.render("home", {
    homeContent: homeStartingContent,
    allPost:allPost
  });
});


app.get("/posts/:para",(req,res)=>{
  const prm=lodash.lowerCase(req.params.para);
  console.log(prm);
  
  allPost.forEach((elem)=>{
    const title=lodash.lowerCase(elem.title);
    if(title===prm){
      res.render("post",{title:elem.title,post:elem.post});
    }
    
  })
  

})

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

app.post("/compose",(req,res)=>{
  const newPost={
    title:req.body.title,
    post:req.body.post
  };
  allPost.push(newPost);

  res.redirect("/");
})



//listening
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
