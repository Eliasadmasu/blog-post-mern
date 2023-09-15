import express, { Router } from "express";
import {
  createBlog,
  getAllBlog,
  getBlogPostById,
  granted,
  updatePost,
} from "../controllers/blogController.js";
import upload from "../middleware/multerConfig.js";
import {
  login,
  refreshToken,
  register,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);
// authentication

router.post("/create", upload.single("photo"), verifyToken, createBlog);

router.get("/all", getAllBlog);

router.put("/update/:id", upload.single("photo"), verifyToken, updatePost);

router.get("/get/:id", verifyToken, getBlogPostById);

router.get("/refresh-token", refreshToken);

export { router };
