import { Router } from 'express';
import { syncProfile } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();
router.post('/sync', protect, syncProfile);
export default router;
