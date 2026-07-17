import { Router } from 'express';
import { estimateCost } from '../controllers/cost.controller.js';

const router = Router();
router.post('/', estimateCost);
export default router;
