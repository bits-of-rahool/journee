import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    post: {
      type: String,
      required: true,
    },
    userId: {type: String},  
  },
  { timestamps: true },
);
export default new mongoose.model("Blog", blogSchema);
