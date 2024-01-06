import Blog from "../models/Blog.js";

const getPosts = async function (id) {
  try {
    return await Blog.find({ uid: id });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

export default getPosts;
