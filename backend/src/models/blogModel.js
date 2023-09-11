import mongoose from "mongoose";

const blogPost = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const BlogPostModel = mongoose.model("Post", blogPost);

export default BlogPostModel;
