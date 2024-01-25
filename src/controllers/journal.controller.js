import Blog from "../models/blog.model.js";
import wrapper from "../utils/wrapper.js";


const getJournal = wrapper (async function (req,res) {

  const agg= await Blog.aggregate([
    { $match: { userId: req.user.id } },
    { $sort: { createdAt: 1 } },
  ]) 
  return agg;
})


const createJournal = wrapper(async (req, res)=> {
  const newBlog = new Blog({
    title: req.body.title,
    post: req.body.post,
    userId: req.user.id
  });
    await newBlog.save().then((newPost) => {
      res.redirect("/");
})})


export {
  getJournal,
  createJournal
}
