import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getProfile, updateProfile, changePassword, getNotifications } from '../controllers/user.controller.js';

const router = Router();
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.get('/notifications', protect, getNotifications);
export default router;
