import express from "express";
import { register, login } from "../controllers/authController.js";

// Router for handling requests
const router = express.Router();

// Handle requests
router.post("/register", register);
router.post("/login", login);

export default router;
