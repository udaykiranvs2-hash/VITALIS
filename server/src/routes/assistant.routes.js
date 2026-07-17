import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { chat } from '../controllers/assistant.controller.js';

const router = Router();
router.post('/chat', protect, chat);
export default router;
