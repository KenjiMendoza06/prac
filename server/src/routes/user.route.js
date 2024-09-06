import express from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/register").post(upload.single('profilePicture'), registerUser)

export default router;