import express from "express";
import path from "path";
import BlogPostModel from "../models/blogModel.js";
import { error } from "console";

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
      user: req.userId,
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

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const photoPath = req.file ? req.file.filename : null;

  const blogPost = await BlogPostModel.findById(id);

  try {
    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    if (blogPost.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ error: "You do not have permission to edit this post" });
    }
    const updatedBlogPost = await BlogPostModel.findByIdAndUpdate(
      id,
      { title, content, photo: photoPath },
      { new: true }
    );

    if (updatedBlogPost.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ error: "You do not have permission to edit this post" });
    }
    if (!updatedBlogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.status(200).json(updatedBlogPost);
  } catch (err) {
    console.error("Error updating the blog post:", err);
    console.error(err);
  }
};

const getBlogPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const UserById = await BlogPostModel.findById(id);
    if (!UserById) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    const photo = UserById.photo || "";
    const blogPostData = {
      title: UserById.title,
      content: UserById.content,
      photo: photo,
    };
    res.status(200).json(blogPostData);
  } catch (err) {
    console.error("Error retrieving the blog post:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const granted = (req, res) => {
  res.json({ message: "Access granted", user: req.user });
};
export { createBlog, getAllBlog, updatePost, getBlogPostById, granted };
