import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const emergencyKeywords = [
  'chest pain',
  'shortness of breath',
  'severe headache',
  'loss of consciousness',
  'blood in stool',
  'sudden weakness',
  'blurred vision'
];

const specialistMap = {
  cardiology: 'Cardiologist',
  dermatology: 'Dermatologist',
  neurology: 'Neurologist',
  orthopedics: 'Orthopedic Surgeon',
  gastroenterology: 'Gastroenterologist',
  general: 'General Physician'
};

const reportTemplates = {
  'Blood Test': {
    findings: [
      'Hemoglobin is within normal limits.',
      'Cholesterol is mildly elevated and should be monitored.',
      'Blood glucose is stable for the current profile.'
    ],
    abnormalValues: ['Total cholesterol'],
    summary: 'The blood test shows a healthy hematological profile, with a mild rise in cholesterol that can be managed with diet and follow-up testing.'
  },
  CBC: {
    findings: [
      'White blood cell count is normal.',
      'Red blood cell count is healthy.',
      'Platelet count is within expected range.'
    ],
    abnormalValues: [],
    summary: 'CBC metrics appear balanced. There are no urgent abnormalities in the complete blood count.'
  },
  Thyroid: {
    findings: [
      'TSH is slightly elevated, indicating possible hypothyroid tendencies.',
      'Free T4 level is within the lower normal range.'
    ],
    abnormalValues: ['TSH'],
    summary: 'Thyroid function may be slowing down. A follow-up evaluation with an endocrinologist is recommended.'
  },
  Kidney: {
    findings: [
      'Creatinine is within the normal range.',
      'Estimated GFR is stable and supports healthy kidney function.'
    ],
    abnormalValues: [],
    summary: 'Kidney markers are healthy. Continue hydration and review any medications that affect renal function.'
  },
  Liver: {
    findings: [
      'ALT and AST are mildly elevated.',
      'Bilirubin levels are within normal limits.'
    ],
    abnormalValues: ['ALT', 'AST'],
    summary: 'Liver enzymes are slightly elevated. Avoid alcohol and follow up with your healthcare provider for additional testing.'
  },
  ECG: {
    findings: [
      'Heart rate is regular.',
      'No acute ischemic changes identified.',
      'Rhythm appears normal for this recording.'
    ],
    abnormalValues: [],
    summary: 'ECG is stable with no signs of acute concern. Maintain cardiovascular health and discuss any chest discomfort with your doctor.'
  }
};

const buildLocalSymptomAssessment = ({ age, gender, symptoms = [], duration, severity }) => {
  const normalized = symptoms.map((item) => item.trim().toLowerCase()).filter(Boolean);
  const isEmergency = normalized.some((symptom) =>
    emergencyKeywords.some((keyword) => symptom.includes(keyword))
  );
  const possibleConditions = new Set();

  if (normalized.some((symptom) => symptom.includes('fever'))) {
    possibleConditions.add('Viral infection');
    possibleConditions.add('Heat-related illness');
  }

  if (normalized.some((symptom) => symptom.includes('cough'))) {
    possibleConditions.add('Upper respiratory infection');
  }

  if (normalized.some((symptom) => symptom.includes('pain'))) {
    possibleConditions.add('Muscle strain');
  }

  if (normalized.some((symptom) => symptom.includes('headache'))) {
    possibleConditions.add('Tension headache');
    possibleConditions.add('Migraine');
  }

  if (normalized.some((symptom) => symptom.includes('stomach') || symptom.includes('nausea'))) {
    possibleConditions.add('Gastritis');
  }

  const conditions = Array.from(possibleConditions.size ? possibleConditions : ['General wellness review']);
  const confidence = Math.min(98, 60 + conditions.length * 8 + (severity === 'severe' ? 15 : 0));

  const suggestedSpecialist = normalized.some((symptom) => symptom.includes('skin'))
    ? specialistMap.dermatology
    : normalized.some((symptom) => symptom.includes('heart') || symptom.includes('chest'))
    ? specialistMap.cardiology
    : normalized.some((symptom) => symptom.includes('headache') || symptom.includes('vision'))
    ? specialistMap.neurology
    : specialistMap.general;

  const recommendations = [
    'Keep a symptom journal and note any changes over the next 24–48 hours.',
    'Stay hydrated and rest when possible.',
    'Contact your primary care provider if symptoms worsen or last longer than expected.'
  ];

  if (severity === 'severe' || isEmergency) {
    recommendations.unshift('Please seek immediate medical attention or visit the nearest emergency department.');
  }

  return {
    possibleConditions: conditions,
    confidence: `${confidence}%`,
    severityLevel: severity || 'moderate',
    suggestedSpecialist,
    nextSteps: recommendations,
    emergencyWarning: isEmergency
      ? {
          headline: '🚨 Emergency Warning',
          message: 'Your symptoms may indicate a serious condition. Visit the nearest emergency department or contact emergency services immediately.'
        }
      : null,
    disclaimer: 'This assessment is informational only and is not a substitute for professional medical advice.'
  };
};

export const buildSymptomAssessment = async ({ age, gender, symptoms = [], duration, severity, medicalHistory = [], allergies = [], medications = [] }) => {
  if (ai) {
    try {
      const symptomsList = Array.isArray(symptoms) ? symptoms.join(', ') : symptoms;
      const historyList = Array.isArray(medicalHistory) ? medicalHistory.join(', ') : medicalHistory;
      const allergiesList = Array.isArray(allergies) ? allergies.join(', ') : allergies;
      const medsList = Array.isArray(medications) ? medications.join(', ') : medications;

      const prompt = `Act as an AI medical diagnostic assistant. Review the following symptom assessment request:
- Patient Age: ${age}
- Patient Gender: ${gender}
- Symptoms: ${symptomsList}
- Duration: ${duration}
- Severity: ${severity}
- Medical History: ${historyList || 'None'}
- Allergies: ${allergiesList || 'None'}
- Current Medications: ${medsList || 'None'}

Evaluate the symptoms. Based on clinical guidelines:
1. Determine the severity level ("mild", "moderate", "severe").
2. Check if the symptoms could indicate a life-threatening medical emergency (e.g. chest pain, severe shortness of breath, sudden weakness/numbness, etc.). If so, return an "emergencyWarning" object containing a "headline" (e.g. "🚨 Emergency Warning") and a "message" with advice to seek immediate emergency care. If not, "emergencyWarning" must be null.
3. List up to 3 possible conditions (as clean, simple strings, e.g., "Common Cold", "Influenza").
4. Provide a confidence level percentage (e.g. "80%").
5. Recommend the most appropriate medical specialist category (e.g., "Cardiologist", "Pulmonologist", "Dermatologist", "General Physician").
6. Suggest 3-4 next steps/care recommendations.
7. Include a standard medical disclaimer.

You MUST respond strictly in JSON format. The response schema must be:
{
  "disclaimer": "This assessment is informational only and is not a substitute for professional medical advice.",
  "emergencyWarning": null or {
    "headline": "🚨 Emergency Warning",
    "message": "Immediate emergency care is advised..."
  },
  "possibleConditions": ["Condition A", "Condition B"],
  "confidence": "85%",
  "severityLevel": "moderate",
  "suggestedSpecialist": "General Physician",
  "nextSteps": ["Step 1", "Step 2", "Step 3"]
}

JSON Response:`;

      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text.trim());
      if (parsed.possibleConditions && parsed.confidence && parsed.severityLevel && parsed.suggestedSpecialist && parsed.nextSteps) {
        return parsed;
      }
    } catch (error) {
      console.error('Gemini Symptom Assessment Error, falling back to mock:', error.message);
    }
  }

  return buildLocalSymptomAssessment({ age, gender, symptoms, duration, severity });
};

const analyzeReportDocumentLocal = ({ reportType = 'General Lab Report', fileName = '', rawText = '' }) => {
  const base = reportTemplates[reportType] || {
    findings: ['The report was reviewed and appears structurally complete.'],
    abnormalValues: [],
    summary: 'The submitted report is being interpreted using standard clinical markers. No urgent findings were identified.'
  };

  const abnormalValues = [...base.abnormalValues];
  const findings = [...base.findings];
  const summary = base.summary;

  if (rawText && rawText.toLowerCase().includes('high')) {
    findings.push('The report includes high value markers that may need follow-up.');
    abnormalValues.push('Reported high-value marker');
  }

  if (rawText && rawText.toLowerCase().includes('low')) {
    findings.push('The report includes low value markers that may need further attention.');
    abnormalValues.push('Reported low-value marker');
  }

  const recommendations = [
    'Review these findings with a qualified healthcare provider.',
    'Maintain hydration and track symptoms alongside this report.',
    'Schedule a follow-up appointment for any abnormal markers.'
  ];

  return {
    title: `${reportType} Analysis`,
    fileName,
    reportType,
    summary,
    findings,
    abnormalValues,
    recommendations,
    disclaimer: 'This report analysis is for educational purposes only and does not replace clinical diagnosis.'
  };
};

export const analyzeReportDocument = async ({ reportType = 'General Lab Report', fileName = '', rawText = '' }) => {
  if (ai) {
    try {
      const prompt = `Act as an AI medical report analyzer. Analyze the following medical diagnostic/lab report details:
- Report Type: ${reportType}
- File Name: ${fileName}
- Report Raw Text:
${rawText}

Task:
1. Provide a professional, concise summary (2-3 sentences) of the overall report findings.
2. Extract the key findings (as an array of strings).
3. Identify any abnormal/out-of-range values or markers (as an array of strings).
4. Provide 3 actionable recommendations or follow-up suggestions (as an array of strings).
5. Include a standard clinical educational disclaimer.

You MUST respond strictly in JSON format. The response schema must be:
{
  "title": "${reportType} Analysis",
  "fileName": "${fileName}",
  "reportType": "${reportType}",
  "summary": "Overall summary of the report...",
  "findings": ["Finding 1", "Finding 2"],
  "abnormalValues": ["Abnormal Marker 1"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "disclaimer": "This report analysis is for educational purposes only and does not replace clinical diagnosis."
}

JSON Response:`;

      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text.trim());
      if (parsed.summary && parsed.findings && parsed.abnormalValues && parsed.recommendations) {
        return {
          title: parsed.title || `${reportType} Analysis`,
          fileName: parsed.fileName || fileName,
          reportType: parsed.reportType || reportType,
          summary: parsed.summary,
          findings: parsed.findings,
          abnormalValues: parsed.abnormalValues,
          recommendations: parsed.recommendations,
          disclaimer: parsed.disclaimer || 'This report analysis is for educational purposes only and does not replace clinical diagnosis.'
        };
      }
    } catch (error) {
      console.error('Gemini Report Analyzer Error, falling back to mock:', error.message);
    }
  }

  return analyzeReportDocumentLocal({ reportType, fileName, rawText });
};

export const analyzeXrayImage = async ({ fileName = 'Uploaded X-ray', mimeType = '', buffer }) => {
  const disclaimer = 'This screening is educational only. It is not a diagnosis and must be reviewed by a qualified radiologist or clinician.';

  if (ai && buffer && ['image/jpeg', 'image/png', 'image/jpg'].includes(mimeType)) {
    try {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [
          { inlineData: { mimeType, data: buffer.toString('base64') } },
          { text: `You are an educational medical-image screening assistant. Review this uploaded X-ray image cautiously. Do not claim a diagnosis. Return strict JSON with: summary (2 concise sentences), findings (up to 4 observations, explicitly say when image quality limits review), riskLevel (Low, Moderate, or Needs clinical review), recommendations (3 next steps), and disclaimer. Emphasize urgent clinical review for any possible concerning finding.` }
        ] }],
        config: { responseMimeType: 'application/json', temperature: 0.2 }
      });
      const parsed = JSON.parse(response.text.trim());
      if (parsed.summary && Array.isArray(parsed.findings) && Array.isArray(parsed.recommendations)) {
        return { title: 'X-ray Analysis Result', fileName, summary: parsed.summary, findings: parsed.findings, riskLevel: parsed.riskLevel || 'Needs clinical review', recommendations: parsed.recommendations, disclaimer: parsed.disclaimer || disclaimer, aiAvailable: true };
      }
    } catch (error) {
      console.error('Gemini X-ray analysis failed, using local screening response:', error.message);
    }
  }

  return {
    title: 'X-ray Upload Review', fileName,
    summary: 'Your X-ray image was uploaded successfully. This local version can verify the upload and prepare a review, but image-level AI interpretation requires a configured clinical imaging model.',
    findings: ['Image file received and queued for clinical review.', 'No diagnostic conclusion is shown in local screening mode.', 'A qualified radiologist should review the original image and clinical history.'],
    riskLevel: 'Needs clinical review',
    recommendations: ['Share the original X-ray with your radiologist or treating clinician.', 'Seek urgent care for severe breathlessness, chest pain, blue lips, or worsening symptoms.', 'Add a Gemini API key on the server to enable AI-assisted image screening.'],
    disclaimer,
    aiAvailable: false
  };
};
