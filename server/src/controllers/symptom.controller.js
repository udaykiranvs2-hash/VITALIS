import supabase from '../config/supabase.js';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Emergency keywords to short-circuit the AI assessment
export const emergencyKeywords = [
  'chest pain',
  'shortness of breath',
  'difficulty breathing',
  'severe headache',
  'loss of consciousness',
  'blood in stool',
  'sudden weakness',
  'blurred vision',
  'stroke',
  'heart attack'
];

export const assessSymptoms = async (req, res) => {
  try {
    const { age, gender, duration, severity, symptoms, medicalHistory, allergies, medications, lifestyle } = req.body;

    // Validate incoming payload
    if (!age || !gender || !symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ message: 'Age, gender, and at least one symptom are required.' });
    }

    const symptomsList = symptoms.join(', ');
    const historyList = Array.isArray(medicalHistory) ? medicalHistory.join(', ') : '';
    const allergiesList = Array.isArray(allergies) ? allergies.join(', ') : '';
    const medsList = Array.isArray(medications) ? medications.join(', ') : '';
    
    // Hard-coded safety check: Emergency keywords
    const isEmergency = symptoms.some((s) => 
      emergencyKeywords.some((keyword) => s.toLowerCase().includes(keyword))
    ) || severity === 'emergency';

    let result;

    if (isEmergency) {
      // Short-circuit for emergencies
      result = {
        disclaimer: 'This assessment is informational only and is not a substitute for professional medical advice.',
        emergencyWarning: {
          headline: '🚨 Emergency Warning',
          message: 'Immediate emergency care is advised. Your symptoms indicate a potentially serious condition. Visit the nearest emergency department or contact emergency services immediately.'
        },
        possibleConditions: ['Medical Emergency'],
        confidence: '99%',
        severityLevel: 'emergency',
        suggestedSpecialist: 'Emergency Department',
        nextSteps: ['Seek immediate emergency medical care', 'Do not drive yourself to the hospital']
      };
    } else if (ai) {
      // Call Gemini for structured assessment
      const prompt = `Act as an AI medical diagnostic assistant. Review the following symptom assessment request:
- Patient Age: ${age}
- Patient Gender: ${gender}
- Symptoms: ${symptomsList}
- Duration: ${duration || 'Unknown'}
- Severity: ${severity || 'Unknown'}
- Medical History: ${historyList || 'None'}
- Allergies: ${allergiesList || 'None'}
- Current Medications: ${medsList || 'None'}

Evaluate the symptoms. Based on clinical guidelines:
1. Determine the severity level ("mild", "moderate", "severe").
2. Check if the symptoms could indicate a life-threatening medical emergency. If so, return an "emergencyWarning" object containing a "headline" (e.g. "🚨 Emergency Warning") and a "message" with advice to seek immediate emergency care. If not, "emergencyWarning" must be null.
3. List up to 3 possible conditions (as clean, simple strings, e.g., "Common Cold", "Influenza").
4. Provide a confidence level percentage (e.g. "80%").
5. Recommend the most appropriate medical specialist category (e.g., "Cardiologist", "Pulmonologist", "Dermatologist", "General Physician").
6. Suggest 3-4 next steps/care recommendations.
7. Include a standard medical disclaimer.

You MUST respond strictly in JSON format. The response schema must be:
{
  "disclaimer": "This assessment is informational only and is not a substitute for professional medical advice.",
  "emergencyWarning": null,
  "possibleConditions": ["Condition A", "Condition B"],
  "confidence": "85%",
  "severityLevel": "moderate",
  "suggestedSpecialist": "General Physician",
  "nextSteps": ["Step 1", "Step 2", "Step 3"]
}

JSON Response:`;

      const generateAttempt = async () => {
        const response = await ai.models.generateContent({
          model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });
        const parsed = JSON.parse(response.text.trim());
        if (!parsed.possibleConditions || !parsed.severityLevel || !parsed.nextSteps) {
          throw new Error('Malformed JSON missing required keys');
        }
        return parsed;
      };

      try {
        result = await generateAttempt();
      } catch (firstError) {
        console.warn('Gemini first attempt failed, retrying once...', firstError.message);
        try {
          result = await generateAttempt();
        } catch (secondError) {
          console.error('Gemini second attempt failed:', secondError.message);
          return res.status(503).json({ message: 'AI assessment service is currently unavailable. Please try again later.' });
        }
      }
    } else {
      // Fallback if AI not configured
      result = {
        disclaimer: 'This assessment is informational only and is not a substitute for professional medical advice.',
        emergencyWarning: null,
        possibleConditions: ['General wellness review'],
        confidence: '70%',
        severityLevel: severity || 'moderate',
        suggestedSpecialist: 'General Physician',
        nextSteps: ['Keep a symptom journal', 'Contact primary care if symptoms worsen']
      };
    }

    // Persist to Supabase if available
    if (supabase) {
      const payload = {
        user_id: req.userId,
        demographics: { age, gender },
        symptoms: {
          symptomsList,
          duration,
          severity,
          medicalHistory: historyList,
          allergies: allergiesList,
          medications: medsList,
          lifestyle
        },
        ai_assessment: result,
        severity_level: result.severityLevel || 'unknown'
      };

      const { error } = await supabase.from('symptom_history').insert([payload]);
      
      if (error) {
        console.error('Error inserting into symptom_history:', error.message);
        // We continue to return the result even if logging fails
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Symptom assessment error:', error.message);
    return res.status(500).json({ message: 'Internal server error during assessment.' });
  }
};

export const getSymptomHistory = async (req, res) => {
  try {
    if (!supabase) {
      return res.status(200).json([]);
    }

    // Explicitly filter by user_id = req.userId to enforce access control
    const { data, error } = await supabase
      .from('symptom_history')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching symptom history:', error.message);
      return res.status(500).json({ message: 'Failed to fetch history.' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Symptom history fetch error:', error.message);
    return res.status(500).json({ message: 'Internal server error fetching history.' });
  }
};
