import supabase from '../config/supabase.js';
import { createLLMProvider } from '../ai/llm/factory.js';
import { GeminiEmbeddingProvider } from '../ai/embeddings/provider.js';
import { VectorStore } from '../ai/vector/search.js';
import { EmergencyEngine } from '../ai/rag/emergency.engine.js';
import { FollowUpEngine } from '../ai/rag/followup.engine.js';
import { RagRetriever } from '../ai/rag/retriever.js';
import { SymptomAnalysisService } from '../ai/rag/analyzer.js';
import { NormalizerEngine } from '../ai/rag/normalizer.engine.js';
import { buildSymptomAssessment, buildLocalSymptomAssessment } from '../services/ai.service.js';

// Initialize the new AI Architecture using Dependency Injection
let aiService = null;
try {
  if (process.env.GEMINI_API_KEY) {
    const llmProvider = createLLMProvider();
    const embeddingProvider = new GeminiEmbeddingProvider(process.env.GEMINI_API_KEY);
    const vectorStore = new VectorStore(embeddingProvider);
    
    const normalizerEngine = new NormalizerEngine(llmProvider);
    const emergencyEngine = new EmergencyEngine();
    const followupEngine = new FollowUpEngine(llmProvider);
    const ragRetriever = new RagRetriever(vectorStore);
    
    aiService = new SymptomAnalysisService(normalizerEngine, emergencyEngine, followupEngine, ragRetriever, llmProvider);
    console.log('[SymptomController] AI Architecture initialized successfully.');
  }
} catch (err) {
  console.warn('[SymptomController] AI Services initialization failed:', err.message);
}

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

    let result;

    if (aiService) {
      try {
        // Route the request through the orchestrator
        const aiResult = await aiService.analyze({
          symptoms,
          profile: { 
            age, 
            gender, 
            duration, 
            severity, 
            medicalHistory: historyList, 
            allergies: allergiesList, 
            medications: medsList, 
            lifestyle 
          }
        });

        // Adapter Pattern: Map the output to the exact frontend schema
        let emergencyWarning = null;
        if (aiResult.emergency) {
          emergencyWarning = {
            headline: '🚨 Emergency Warning',
            message: 'Immediate emergency care is advised. Your symptoms indicate a potentially serious condition.'
          };
        }

        if (aiResult.needsFollowUp) {
          result = {
            needsFollowUp: true,
            questions: aiResult.questions,
            disclaimer: 'This assessment is informational only and is not a substitute for professional medical advice.',
          };
        } else {
          result = {
            needsFollowUp: false,
            disclaimer: 'This assessment is informational only and is not a substitute for professional medical advice.',
            emergencyWarning,
            possibleConditions: aiResult.possibleConditions || [],
            confidence: aiResult.confidence || '70%',
            severityLevel: severity || 'moderate',
            suggestedSpecialist: aiResult.specialist || 'General Physician',
            summaryPoints: aiResult.summaryPoints || [
              `You are currently experiencing ${symptomsList} for ${duration || 'a few days'} with ${severity || 'moderate'} severity.`,
              'Your body is actively working to manage your health and restore your natural metabolic balance.',
              'Prioritizing rest and proper care now will support your body\'s natural recovery.'
            ],
            preventionSteps: aiResult.preventionSteps || [
              'Drink plenty of warm fluids (water, herbal teas, or clear broths) throughout the day to stay well-hydrated.',
              'Get at least 7 to 8 hours of quiet, restful sleep each night to rebuild strength.',
              'Avoid cold drafts, heavy or fried foods, and strenuous physical exertion while recovering.',
              'Practice good hygiene and wash hands frequently to protect against secondary infections.'
            ],
            nextSteps: aiResult.nextSteps || []
          };
        }
      } catch (aiError) {
        console.error('[SymptomController] AI Analysis Error:', aiError.message);
        result = null; // Trigger local fallback
      }
    }
    
    if (!result) {
      // High-grade fallback if AI architecture fails or hits API quota limits
      result = buildLocalSymptomAssessment({ age, gender, symptoms, duration, severity });
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
