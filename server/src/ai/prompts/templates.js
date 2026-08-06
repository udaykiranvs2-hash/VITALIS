/**
 * Core system instruction ensuring the LLM acts as a strict, professional medical engine.
 */
export const SYSTEM_ROLE_MEDICAL_ASSISTANT = `You are Vitalis AI, an advanced and highly accurate medical analysis engine. 
You are a clinical decision support tool, NOT a conversational chatbot. 
Your primary objective is to analyze symptoms and patient data against provided medical contexts.
Rules:
1. Rely primarily on the provided Medical Context.
2. Never invent medical facts or hallucinate conditions.
3. Always maintain a clinical, objective, and professional tone.
4. If the symptoms indicate an emergency, flag it immediately.
5. Always remind the user to consult a real healthcare professional.`;

/**
 * Builds the prompt for the Follow-Up Question Engine.
 */
export const buildFollowUpPrompt = ({ symptoms, profile, missingFieldsContext }) => `
Based on the following patient report, identify what critical information is missing to make a safe assessment.

Patient Profile: ${JSON.stringify(profile)}
Reported Symptoms: ${symptoms.join(', ')}
Relevant Medical Rules: ${missingFieldsContext}

Task:
ONLY if the symptoms are completely vague and impossible to analyze, formulate exactly 1 targeted follow-up question.
If the patient provided ANY specific symptom, indicate that no further questions are needed.
Respond strictly in JSON format:
{ "needsMoreInfo": boolean, "questions": ["question 1"] }
`;

/**
 * Builds the prompt for the final Symptom Analysis service.
 * Enforces the exact requested JSON output structure.
 */
export const buildSymptomAnalysisPrompt = ({ symptoms, profile, context }) => `
Analyze the following patient case strictly using the provided Medical Context.

Patient Profile:
${JSON.stringify(profile, null, 2)}

Reported Symptoms:
${symptoms.join(', ')}

Medical Context (from Knowledge Base):
${context}

Task:
Generate a structured JSON response evaluating the possible conditions.
Output MUST strictly match this JSON schema:
{
  "possibleConditions": ["Condition A", "Condition B"],
  "confidence": "Low | Medium | High",
  "reasoning": "Brief clinical reasoning based on the context...",
  "recommendedTests": ["Test A", "Test B"],
  "homeCare": ["Rest", "Hydration"],
  "specialist": "Type of doctor to see",
  "redFlags": ["Any severe symptoms to watch for"],
  "emergency": boolean,
  "nextSteps": ["Step 1", "Step 2"],
  "references": ["Source 1", "Source 2"]
}
`;

/**
 * Builds a quick prompt for the Emergency Rule Engine fallback (if LLM is needed to verify).
 */
export const buildEmergencyAssessmentPrompt = ({ symptoms }) => `
Evaluate the following symptoms for immediate, life-threatening medical emergencies (e.g., stroke, heart attack, anaphylaxis).
Symptoms: ${symptoms.join(', ')}

Respond strictly in JSON:
{ "isEmergency": boolean, "reason": "Brief reason if true", "immediateAction": "Call 911 / Go to ER / null" }
`;

/**
 * Builds the prompt for normalizing colloquial symptoms into standard medical terms.
 */
export const buildSymptomNormalizationPrompt = ({ symptoms }) => `
Translate the following colloquial or user-provided symptom descriptions into standardized medical terminology. 
Correct any typos. If a symptom is already a standard medical term, leave it as is or correct its spelling.
Do not hallucinate conditions or invent symptoms.

Reported Symptoms: ${symptoms.join(', ')}

Task:
Generate a structured JSON response containing the list of normalized symptoms.
Output MUST strictly match this JSON schema:
{
  "normalizedSymptoms": ["clinical term 1", "clinical term 2"]
}
`;
