import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { checkSymptoms, analyzeReport, getHistory, bookAppointment, cancelAppointment } from '../controllers/health.controller.js';

const router = Router();
router.post('/symptoms', protect, checkSymptoms);
router.post('/report', protect, analyzeReport);
router.get('/history', protect, getHistory);
router.post('/appointment', protect, bookAppointment);
router.delete('/appointment/:id', protect, cancelAppointment);
export default router;
