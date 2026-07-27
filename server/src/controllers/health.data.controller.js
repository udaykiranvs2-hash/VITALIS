import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../data');

// Load JSON data files
const loadJsonFile = (filename) => {
  try {
    const filePath = path.join(dataPath, filename);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error.message);
    return [];
  }
};

// Get all diseases
export const getAllDiseases = async (req, res) => {
  try {
    const diseases = loadJsonFile('diseases.json');
    res.json(diseases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get disease by ID
export const getDiseaseById = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    const diseases = loadJsonFile('diseases.json');
    const disease = diseases.find(d => d.disease_id === diseaseId);
    
    if (!disease) {
      return res.status(404).json({ error: 'Disease not found' });
    }

    // Get additional details
    const details = loadJsonFile('disease_details.json');
    const diseaseDetail = details.find(d => d.disease_id === diseaseId);
    
    const costs = loadJsonFile('treatment_costs.json');
    const treatmentCost = costs.find(c => c.disease_id === diseaseId);

    const symptomMapping = loadJsonFile('disease_symptom_mapping.json');
    const symptoms = loadJsonFile('symptoms.json');
    const diseaseSymptoms = symptomMapping
      .filter(m => m.disease_id === diseaseId)
      .map(m => {
        const symptom = symptoms.find(s => s.symptom_id === m.symptom_id);
        return { ...symptom, ...m };
      });

    res.json({
      ...disease,
      ...diseaseDetail,
      treatmentCost,
      symptoms: diseaseSymptoms
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all symptoms
export const getAllSymptoms = async (req, res) => {
  try {
    const symptoms = loadJsonFile('symptoms.json');
    res.json(symptoms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all treatment costs
export const getAllTreatmentCosts = async (req, res) => {
  try {
    const costs = loadJsonFile('treatment_costs.json');
    res.json(costs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get treatment cost by disease ID
export const getTreatmentCostByDisease = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    const costs = loadJsonFile('treatment_costs.json');
    const cost = costs.find(c => c.disease_id === diseaseId);
    
    if (!cost) {
      return res.status(404).json({ error: 'Treatment cost not found' });
    }

    res.json(cost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get disease-symptom mapping
export const getDiseaseSymptomsMapping = async (req, res) => {
  try {
    const mapping = loadJsonFile('disease_symptom_mapping.json');
    res.json(mapping);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get emergency flags
export const getEmergencyFlags = async (req, res) => {
  try {
    const flags = loadJsonFile('emergency_flags.json');
    res.json(flags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get emergency flags by symptom
export const getEmergencyFlagsBySymptom = async (req, res) => {
  try {
    const { symptomId } = req.params;
    const flags = loadJsonFile('emergency_flags.json');
    const symptomFlags = flags.filter(f => f.symptom_id === symptomId);

    if (symptomFlags.length === 0) {
      return res.json([]);
    }

    res.json(symptomFlags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get followup questions
export const getFollowupQuestions = async (req, res) => {
  try {
    const questions = loadJsonFile('followup_questions.json');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get followup questions by symptom
export const getFollowupQuestionsBySymptom = async (req, res) => {
  try {
    const { symptomId } = req.params;
    const questions = loadJsonFile('followup_questions.json');
    const symptomQuestions = questions.filter(q => q.symptom_id === symptomId);

    if (symptomQuestions.length === 0) {
      return res.json([]);
    }

    res.json(symptomQuestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search diseases by keyword
export const searchDiseases = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const diseases = loadJsonFile('diseases.json');
    const results = diseases.filter(d =>
      d.disease_name.toLowerCase().includes(query.toLowerCase()) ||
      d.category.toLowerCase().includes(query.toLowerCase())
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search symptoms by keyword
export const searchSymptoms = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const symptoms = loadJsonFile('symptoms.json');
    const results = symptoms.filter(s =>
      s.symptom_name.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase())
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
