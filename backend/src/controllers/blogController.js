import express from "express";
import path from "path";
import BlogPostModel from "../models/blogModel.js";

const createBlog = async (req, res) => {
  try {
    // Extract data from the request body
    const { title, content } = req.body;

    // Multer adds a "file" property to the request object
    // const photoPath = req.file ? req.file.path : "";
    const photoPath = req.file ? req.file.filename : "";

    // Create a new blog post with the photo path
    const newBlogPost = new BlogPostModel({
      title,
      content,
      photo: photoPath,
    });

    await newBlogPost.save();

    res.status(201).json({ title, content, photoPath });
  } catch (error) {
    console.error("Error creating and saving the blog post:", error);

    // Handle different types of errors
    if (error.name === "ValidationError") {
      // Mongoose validation error (e.g., required fields not provided)
      return res
        .status(400)
        .json({ error: "Validation error", details: error.errors });
    } else {
      // Generic server error
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const getAllBlog = async (req, res) => {
  try {
    const blogs = await BlogPostModel.find();
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export { createBlog, getAllBlog };
