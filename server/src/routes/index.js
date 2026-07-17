import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import healthRoutes from './health.routes.js';
import doctorRoutes from './doctor.routes.js';
import assistantRoutes from './assistant.routes.js';
import medicineRoutes from './medicine.routes.js';
import costRoutes from './cost.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/health', healthRoutes);
router.use('/doctors', doctorRoutes);
router.use('/assistant', assistantRoutes);
router.use('/medicine', medicineRoutes);
router.use('/estimate', costRoutes);
export default router;
