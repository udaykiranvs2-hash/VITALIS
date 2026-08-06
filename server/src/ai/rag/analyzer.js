import { SYSTEM_ROLE_MEDICAL_ASSISTANT, buildSymptomAnalysisPrompt } from '../prompts/templates.js';
import { NormalizerEngine } from './normalizer.engine.js';

/**
 * The core orchestrator for symptom analysis.
 * Ties together the Emergency Engine, FollowUp Engine, RAG Retriever, and LLM Provider.
 */
export class SymptomAnalysisService {
  /**
   * @param {import('./normalizer.engine.js').NormalizerEngine} normalizerEngine
   * @param {import('./emergency.engine.js').EmergencyEngine} emergencyEngine
   * @param {import('./followup.engine.js').FollowUpEngine} followupEngine
   * @param {import('./retriever.js').RagRetriever} ragRetriever
   * @param {import('../llm/provider.js').LLMProvider} llmProvider
   */
  constructor(normalizerEngine, emergencyEngine, followupEngine, ragRetriever, llmProvider) {
    this.normalizerEngine = normalizerEngine;
    this.emergencyEngine = emergencyEngine;
    this.followupEngine = followupEngine;
    this.ragRetriever = ragRetriever;
    this.llmProvider = llmProvider;
  }

  /**
   * Orchestrates the medical analysis flow.
   * 
   * @param {Object} patientData
   * @param {string[]} patientData.symptoms
   * @param {Object} patientData.profile - includes age, gender, medical history, allergies, medications
   * @returns {Promise<Object>} The structured JSON analysis or follow-up request
   */
  async analyze(patientData) {
    console.log('[SymptomAnalysisService] analyze() called with payload:', JSON.stringify(patientData));
    const { symptoms = [], profile = {} } = patientData;

    // 0. NORMALIZE SYMPTOMS
    console.log('[SymptomAnalysisService] Normalizing symptoms...');
    const normalizedSymptoms = await this.normalizerEngine.normalize(symptoms);
    console.log('[SymptomAnalysisService] Symptoms normalized:', normalizedSymptoms);

    // 1. FAST EMERGENCY CHECK
    const emergencyResult = await this.emergencyEngine.evaluate(normalizedSymptoms, profile);
    if (emergencyResult.isEmergency) {
      return {
        possibleConditions: ["Unknown Medical Emergency"],
        confidence: "High",
        reasoning: emergencyResult.reason,
        recommendedTests: [],
        homeCare: [],
        specialist: "Emergency Medicine",
        redFlags: symptoms,
        emergency: true,
        nextSteps: [emergencyResult.immediateAction, "Do not wait for further analysis."],
        references: ["Vitalis Emergency Protocol"]
      };
    }

    // 2. FOLLOW-UP QUESTION ENGINE
    // Checks if we have enough context to make a safe RAG query.
    const followupResult = await this.followupEngine.evaluate(normalizedSymptoms, profile);
    if (followupResult.needsMoreInfo && followupResult.questions.length > 0) {
      // The API layer will read this flag and prompt the user for answers
      return {
        needsFollowUp: true,
        questions: followupResult.questions,
        emergency: false
      };
    }

    // 3. RAG RETRIEVAL
    // We only pull what we absolutely need, preventing token bloat and hallucination.
    const context = await this.ragRetriever.retrieveContext(normalizedSymptoms);

    // 4. LLM GENERATION
    const prompt = buildSymptomAnalysisPrompt({
      symptoms: normalizedSymptoms,
      profile,
      context
    });

    try {
      const response = await this.llmProvider.generateJSON({
        systemPrompt: SYSTEM_ROLE_MEDICAL_ASSISTANT,
        prompt,
        temperature: 0.1 // Keep temperature extremely low for clinical accuracy
      });

      return {
        ...response,
        needsFollowUp: false,
        emergency: response.emergency || false
      };
    } catch (err) {
      console.error('[SymptomAnalyzer] Failed to generate analysis:', err.message);
      throw new Error('Analysis generation failed. Please try again or consult a doctor.');
    }
  }
}
