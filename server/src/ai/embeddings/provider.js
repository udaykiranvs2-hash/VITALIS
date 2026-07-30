/**
 * Abstract class representing an Embedding Provider.
 * Allows switching between Gemini, OpenAI, etc. without changing app logic.
 */
export class EmbeddingProvider {
  /**
   * Generates embeddings for an array of text chunks.
   * @param {string[]} texts
   * @returns {Promise<number[][]>} Array of embedding vectors
   */
  async generateEmbeddings(texts) {
    throw new Error('generateEmbeddings() not implemented');
  }
}

/**
 * Gemini implementation of the Embedding Provider using native fetch.
 */
export class GeminiEmbeddingProvider extends EmbeddingProvider {
  constructor(apiKey, model = 'gemini-embedding-2') {
    super();
    this.apiKey = apiKey;
    this.model = model;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  async generateEmbeddings(texts) {
    if (!texts || texts.length === 0) return [];
    
    const embeddings = [];
    // Process sequentially to avoid aggressive rate limiting. In production, use batch endpoints if available.
    for (const text of texts) {
      if (!text || text.trim() === '') {
        embeddings.push([]);
        continue;
      }

      const response = await fetch(`${this.baseUrl}/${this.model}:embedContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: `models/${this.model}`,
          content: { parts: [{ text }] },
          outputDimensionality: 768
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`[Embeddings] Gemini API Error: ${response.status} ${errorBody}`);
      }

      const data = await response.json();
      embeddings.push(data.embedding.values);
    }
    
    return embeddings;
  }
}
