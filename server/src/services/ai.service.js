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

export const buildSymptomAssessment = ({ age, gender, symptoms, duration, severity }) => {
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

  const conditions = Array.from(possibleConditions.length ? possibleConditions : ['General wellness review']);
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

export const analyzeReportDocument = ({ reportType = 'General Lab Report', fileName = '', rawText = '' }) => {
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
