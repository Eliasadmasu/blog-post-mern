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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const BlogPostModel = mongoose.model("Post", blogPost);

export default BlogPostModel;
