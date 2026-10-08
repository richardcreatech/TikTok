import express from "express";

import { getMe, updateMe } from "../controllers/meController.js";
import verifyToken from "../middleware/verifyToken.js";
import upload from "../middleware/upload.js";

const meRoutes = express.Router();

meRoutes.get("/", verifyToken, getMe);
meRoutes.patch("/", verifyToken, upload.single("profile_picture"), updateMe);

export default meRoutes;
