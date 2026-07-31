import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { assessSymptoms, getSymptomHistory } from '../controllers/symptom.controller.js';

const router = Router();

// Protect all symptom routes
router.use(protect);

router.post('/assess', assessSymptoms);
router.get('/history', getSymptomHistory);

export default router;
