import Blog from "../models/Blog.js";
import { User } from "../models/User.js";

const getPosts = async function () {
  let posts;
  await Blog.find({}).then((result) => {
    posts = result;
  });
  return posts;
};

export default getPosts;
