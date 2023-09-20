import express, { Router } from "express";
import {
  createBlog,
  getAllBlog,
  getBlogPostById,
  updatePost,
  deleteBlog,
  MyBlogPost,
} from "../controllers/blogController.js";
import upload from "../middleware/multerConfig.js";
import {
  login,
  newRefreshTokenTest,
  register,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);
// authentication

router.post("/create", upload.single("photo"), verifyToken, createBlog);

router.get("/all", getAllBlog);

//get post by id
router.get("/get/:id", verifyToken, getBlogPostById);

//update post
router.put("/update/:id", upload.single("photo"), verifyToken, updatePost);

//update post
router.delete("/delete/:id", verifyToken, deleteBlog);

//my own blog posts
router.get("/mypost", verifyToken, MyBlogPost);

//my own blog posts

//refresh token route
router.post("/refresh", newRefreshTokenTest);

export { router };
