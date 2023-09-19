import express from "express";
const router = express.Router();
import { register, login } from "../controllers/authController.js";

// Create a router for handling requests
router.post("/register", register);
router.post("/login", login);

export default router;
