import { GeminiLLMProvider } from './provider.js';

/**
 * Factory pattern to instantiate the correct LLM provider based on environment configuration.
 * This ensures the rest of the application never imports a specific provider directly.
 * 
 * @returns {import('./provider.js').LLMProvider}
 */
export const createLLMProvider = () => {
  const activeProvider = process.env.LLM_PROVIDER || 'gemini';
  
  if (activeProvider === 'gemini') {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    
    if (!apiKey) {
      throw new Error('[LLMFactory] GEMINI_API_KEY environment variable is missing.');
    }
    
    return new GeminiLLMProvider(apiKey, model);
  }

  // Future providers can be easily added here
  // if (activeProvider === 'openai') { ... }
  // if (activeProvider === 'groq') { ... }
  // if (activeProvider === 'ollama') { ... }

  throw new Error(`[LLMFactory] Unsupported LLM provider: ${activeProvider}`);
};
