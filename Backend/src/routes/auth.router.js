import express from 'express';
const router = express.Router();
import { signup, signin,signout, updateProfile, checkAuth } from '../controllers/auth.controller.js'; 
import { protectedRoute } from '../middleware/auth.middleware.js';



router.post("/signup", signup); 
router.post("/signin", signin);
router.post("/signout", signout);
router.put("/update-profile", protectedRoute, updateProfile);
router.get("/check", protectedRoute, checkAuth);

export default router;
