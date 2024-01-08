import Blog from "../models/Blog.js";
import wrapper from "../utils/wrapper.js";


 const createJournal = wrapper(async (req, res)=> {

  const newBlog = new Blog({
    title: req.body.title,
    post: req.body.post
  });
  
    await newBlog.save().then((newPost) => {
      res.redirect("/");
})})

export default createJournal
