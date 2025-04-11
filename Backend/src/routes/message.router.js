import express from 'express';
const router = express.Router();
import { getMessage, getUsersForSidebar, sendMessage } from '../controllers/message.controller.js'; 
import { protectedRoute } from '../middleware/auth.middleware.js';
import { checkFriendShip } from '../middleware/friend.middleware.js';

router.get("/users", protectedRoute, getUsersForSidebar)
router.get("/:id", protectedRoute, getMessage)
router.post("/send/:id", protectedRoute, checkFriendShip, sendMessage)


export default router; 