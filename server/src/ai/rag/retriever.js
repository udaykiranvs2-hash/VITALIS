/**
 * RAG Retriever acts as the bridge between the AI logic and the Vector Search database.
 * It retrieves the most relevant chunks of medical knowledge based on patient symptoms,
 * formatting them into a clean string context for the LLM.
 */
export class RagRetriever {
  /**
   * @param {import('../vector/search.js').VectorStore} vectorStore
   */
  constructor(vectorStore) {
    this.vectorStore = vectorStore;
  }

  /**
   * Retrieves highly relevant medical context.
   * 
   * @param {string[]} symptoms
   * @returns {Promise<string>} Formatted text context
   */
  async retrieveContext(symptoms) {
    if (!symptoms || symptoms.length === 0) return '';

    const query = symptoms.join(', ');
    
    // We retrieve the top 5 chunks. The threshold ensures we don't return garbage
    // if the symptoms match absolutely nothing in the DB.
    const results = await this.vectorStore.semanticSearch(query, { 
      limit: 5, 
      threshold: 0.3 
    });
    
    if (!results || results.length === 0) {
      return "No specific database matches found. Rely strictly on foundational medical knowledge.";
    }

    // Combine retrieved chunks into a single readable context string
    return results.map((res, i) => `[Source ${i+1}] ${res.content}`).join('\n\n');
  }
}
