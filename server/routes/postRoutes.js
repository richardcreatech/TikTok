import express from "express";

import { createPost, getPosts, getUserPosts } from "../controllers/postController.js";
import verifyToken from "../middleware/verifyToken.js";
import upload from "../middleware/upload.js";

const postRoutes = express.Router();

postRoutes.post(
  "/",
  verifyToken,
  upload.single("media"),
  createPost
);

postRoutes.get(
  "/",
  verifyToken,
  upload.single("media"),
  getPosts
);

postRoutes.get(
  "/user/:userId",
  verifyToken,
  upload.single("media"),
  getUserPosts
);

export default postRoutes;