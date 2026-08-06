import supabase from '../config/supabase.js';
import { createLLMProvider } from '../ai/llm/factory.js';
import { GeminiEmbeddingProvider } from '../ai/embeddings/provider.js';
import { VectorStore } from '../ai/vector/search.js';
import { EmergencyEngine } from '../ai/rag/emergency.engine.js';
import { FollowUpEngine } from '../ai/rag/followup.engine.js';
import { RagRetriever } from '../ai/rag/retriever.js';
import { SymptomAnalysisService } from '../ai/rag/analyzer.js';
import { NormalizerEngine } from '../ai/rag/normalizer.engine.js';

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
        // Route the request through the new orchestrator
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

        // Adapter Pattern: Map the strictly structured backend output to the exact frontend schema
        let emergencyWarning = null;
        if (aiResult.emergency) {
          emergencyWarning = {
            headline: '🚨 Emergency Warning',
            message: 'Immediate emergency care is advised. Your symptoms indicate a potentially serious condition.'
          };
        }

        if (aiResult.needsFollowUp) {
          // Explicitly pass follow-up state to the frontend
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
            nextSteps: aiResult.nextSteps || []
          };
        }
      } catch (aiError) {
        console.error('[SymptomController] AI Analysis Error:', aiError.message);
        result = null; // Set to null to trigger fallback
      }
    }
    
    if (!result) {
      // Fallback if AI not configured or failed due to API limits
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
