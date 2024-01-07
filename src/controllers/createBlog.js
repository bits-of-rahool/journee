import Blog from "../models/Blog.js";
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export async function createBlog(req, res) {
  const today = new Date().toLocaleDateString("en-IN", options);
  const newBlog = new Blog({
    title: req.body.title,
    post: req.body.post,
    date: today,
    uid: req.user.id,
  });
  let newPost;
  try {
    await newBlog.save().then((newPost) => {
      return newPost;
    });
  } catch (error) {
    res.send(error.message);
  }
}

export default createBlog;
