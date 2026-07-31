import { SYSTEM_ROLE_MEDICAL_ASSISTANT, buildFollowUpPrompt } from '../prompts/templates.js';

/**
 * Engine responsible for determining if enough clinical context has been provided 
 * before proceeding to heavy RAG and diagnosis.
 */
export class FollowUpEngine {
  /**
   * @param {import('../llm/provider.js').LLMProvider} llmProvider
   */
  constructor(llmProvider) {
    this.llmProvider = llmProvider;
  }

  /**
   * Evaluates if the current symptoms lack necessary clinical context to make a safe assessment.
   * 
   * @param {string[]} symptoms
   * @param {Object} patientProfile
   * @returns {Promise<{needsMoreInfo: boolean, questions: string[]}>}
   */
  async evaluate(symptoms, patientProfile) {
    if (!symptoms || symptoms.length === 0) {
      return { 
        needsMoreInfo: true, 
        questions: ["Could you please describe the symptoms you are experiencing?"] 
      };
    }

    // Hardcoded clinical rules injected for the LLM to understand what constitutes "missing info".
    // We want the AI to answer quickly, so ONLY ask follow-up questions if the input is completely useless.
    const missingFieldsContext = `
      - ONLY ask follow-up questions if the symptoms are completely vague (e.g., "I feel bad", "I am sick", "It hurts") with NO specific body parts or conditions mentioned.
      - If ANY specific symptom is mentioned (e.g., "headache", "cough", "stomach pain", "fever", "cut"), YOU MUST PROCEED. Do NOT ask for more info.
      - Never ask more than 1 question.
    `;

    const prompt = buildFollowUpPrompt({
      symptoms,
      profile: patientProfile || {},
      missingFieldsContext
    });

    try {
      const result = await this.llmProvider.generateJSON({
        systemPrompt: SYSTEM_ROLE_MEDICAL_ASSISTANT,
        prompt: prompt,
        temperature: 0.1 // Low temperature for deterministic, logical evaluation
      });

      return {
        needsMoreInfo: !!result.needsMoreInfo,
        questions: Array.isArray(result.questions) ? result.questions : []
      };
    } catch (err) {
      console.error('[FollowUpEngine] Error generating follow-up questions:', err.message);
      // Fallback: If evaluation fails for some reason, assume we have enough info to proceed to RAG
      // so we don't permanently block the user.
      return { needsMoreInfo: false, questions: [] };
    }
  }
}
