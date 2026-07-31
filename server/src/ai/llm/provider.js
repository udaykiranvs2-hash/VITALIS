/**
 * Abstract base class for all LLM providers.
 * Ensures any future provider (OpenAI, Groq, Ollama) adheres to the same interface.
 */
export class LLMProvider {
  /**
   * @param {Object} options
   * @param {string} [options.systemPrompt]
   * @param {string} options.prompt
   * @param {number} [options.temperature=0.2]
   * @returns {Promise<string>}
   */
  async generateText(options) {
    throw new Error('generateText() not implemented');
  }

  /**
   * @param {Object} options
   * @param {string} [options.systemPrompt]
   * @param {string} options.prompt
   * @param {number} [options.temperature=0.2]
   * @returns {Promise<Object>}
   */
  async generateJSON(options) {
    throw new Error('generateJSON() not implemented');
  }
}

/**
 * Gemini implementation of the LLM Provider using native fetch.
 * Fully supports structured JSON mode and system instructions.
 */
export class GeminiLLMProvider extends LLMProvider {
  constructor(apiKey, model = 'gemini-1.5-flash') {
    super();
    this.apiKey = apiKey;
    this.model = model;
    // We use the v1beta endpoint because systemInstruction is natively supported there
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  async _callAPI(payload) {
    const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`[LLMProvider] Gemini API Error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error('[LLMProvider] Invalid or empty response from Gemini.');
    }
    
    return content;
  }

  _buildPayload({ systemPrompt, prompt, temperature, isJSON }) {
    const payload = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: temperature ?? 0.2
      }
    };

    if (systemPrompt) {
      payload.systemInstruction = { parts: [{ text: systemPrompt }] };
    }

    if (isJSON) {
      // Enforces strict JSON return from Gemini
      payload.generationConfig.responseMimeType = 'application/json';
    }

    return payload;
  }

  async generateText({ systemPrompt, prompt, temperature }) {
    const payload = this._buildPayload({ systemPrompt, prompt, temperature, isJSON: false });
    return this._callAPI(payload);
  }

  async generateJSON({ systemPrompt, prompt, temperature }) {
    const payload = this._buildPayload({ systemPrompt, prompt, temperature, isJSON: true });
    const text = await this._callAPI(payload);
    try {
      return JSON.parse(text);
    } catch (err) {
      console.error('[LLMProvider] Failed to parse JSON. Raw output:', text);
      throw new Error(`[LLMProvider] JSON Parsing Error: ${err.message}`);
    }
  }
}
