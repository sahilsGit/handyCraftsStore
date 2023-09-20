import express from "express";
import { 
    updateUser, 
    deleteUser, 
    getUser
} from "../controllers/usersController.js";

import { 
    verifyUser
} from "../utils/verifyToken.js";

// Create a router for handling requests
const router = express.Router();

// UPDATE
router.put("/:id", verifyUser, updateUser)

// DELETE
router.delete("/:id", verifyUser, deleteUser)

// GET 
router.get("/:id", verifyUser, getUser)


export default router

