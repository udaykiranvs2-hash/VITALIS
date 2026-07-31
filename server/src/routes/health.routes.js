import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { analyzeReport, analyzeXray, getHistory, bookAppointment, cancelAppointment } from '../controllers/health.controller.js';
import { uploadReportFile } from '../middleware/upload.middleware.js';
import {
  getAllDiseases,
  getDiseaseById,
  getAllSymptoms,
  getAllTreatmentCosts,
  getTreatmentCostByDisease,
  getDiseaseSymptomsMapping,
  getEmergencyFlags,
  getEmergencyFlagsBySymptom,
  getFollowupQuestions,
  getFollowupQuestionsBySymptom,
  searchDiseases,
  searchSymptoms
} from '../controllers/health.data.controller.js';

const router = Router();

// User health check routes (protected)
router.post('/report', protect, (req, res, next) => {
  uploadReportFile(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, analyzeReport);
router.post('/xray', protect, (req, res, next) => {
  uploadReportFile(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, analyzeXray);

router.get('/history', protect, getHistory);
router.post('/appointment', protect, bookAppointment);
router.delete('/appointment/:id', protect, cancelAppointment);

// Public health data routes
router.get('/diseases', getAllDiseases);
router.get('/diseases/search', searchDiseases);
router.get('/diseases/:diseaseId', getDiseaseById);

router.get('/symptoms', getAllSymptoms);
router.get('/symptoms/search', searchSymptoms);

router.get('/costs', getAllTreatmentCosts);
router.get('/costs/:diseaseId', getTreatmentCostByDisease);

router.get('/disease-symptoms', getDiseaseSymptomsMapping);

router.get('/emergency-flags', getEmergencyFlags);
router.get('/emergency-flags/symptom/:symptomId', getEmergencyFlagsBySymptom);

router.get('/followup-questions', getFollowupQuestions);
router.get('/followup-questions/symptom/:symptomId', getFollowupQuestionsBySymptom);

export default router;
