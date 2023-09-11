import express, { Router } from "express";
import { createBlog, getAllBlog } from "../controllers/blogController.js";
import upload from "../middleware/multerConfig.js";

const router = Router();

router.post("/create", upload.single("photo"), createBlog);

router.get("/all", getAllBlog);

export { router };
