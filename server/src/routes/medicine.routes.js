import { Router } from 'express';
import { searchMedicine } from '../controllers/medicine.controller.js';

const router = Router();
router.get('/search', searchMedicine);
export default router;
