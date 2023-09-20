import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  blogPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BlogPost",
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
