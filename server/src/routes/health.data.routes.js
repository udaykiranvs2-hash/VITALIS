import express from 'express';
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

const router = express.Router();

// Disease routes
router.get('/diseases', getAllDiseases);
router.get('/diseases/:diseaseId', getDiseaseById);
router.get('/diseases/search', searchDiseases);

// Symptom routes
router.get('/symptoms', getAllSymptoms);
router.get('/symptoms/search', searchSymptoms);

// Treatment cost routes
router.get('/costs', getAllTreatmentCosts);
router.get('/costs/:diseaseId', getTreatmentCostByDisease);

// Mapping routes
router.get('/disease-symptoms', getDiseaseSymptomsMapping);

// Emergency flags routes
router.get('/emergency-flags', getEmergencyFlags);
router.get('/emergency-flags/symptom/:symptomId', getEmergencyFlagsBySymptom);

// Followup questions routes
router.get('/followup-questions', getFollowupQuestions);
router.get('/followup-questions/symptom/:symptomId', getFollowupQuestionsBySymptom);

export default router;
