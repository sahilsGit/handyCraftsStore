import express from "express";
import { 
    updateUser, 
    deleteUser, 
    getUser
} from "../controllers/usersController.js";

import { 
    verifyUser
} from "../utils/verifyToken.js";

// Create router for handling requests
const router = express.Router();

// UPDATE req.
router.put("/:id", verifyUser, updateUser)

// DELETE req.
router.delete("/:id", verifyUser, deleteUser)

// GET req.
router.get("/:id", verifyUser, getUser)


export default router

