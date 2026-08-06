import { SYSTEM_ROLE_MEDICAL_ASSISTANT, buildSymptomNormalizationPrompt } from '../prompts/templates.js';

/**
 * Normalizes colloquial or typo-ridden symptoms into standard clinical terms.
 */
export class NormalizerEngine {
  /**
   * @param {import('../llm/provider.js').LLMProvider} llmProvider
   */
  constructor(llmProvider) {
    this.llmProvider = llmProvider;
  }

  /**
   * @param {string[]} symptoms
   * @returns {Promise<string[]>}
   */
  async normalize(symptoms) {
    if (!symptoms || symptoms.length === 0) return [];

    const prompt = buildSymptomNormalizationPrompt({ symptoms });

    try {
      const response = await this.llmProvider.generateJSON({
        systemPrompt: SYSTEM_ROLE_MEDICAL_ASSISTANT,
        prompt,
        temperature: 0.1
      });

      return response.normalizedSymptoms || symptoms;
    } catch (err) {
      console.error('[NormalizerEngine] Failed to normalize symptoms:', err.message);
      // Fallback to original symptoms on failure
      return symptoms;
    }
  }
}
