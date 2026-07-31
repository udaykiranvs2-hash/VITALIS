import supabase from '../../config/supabase.js';

/**
 * Handles semantic vector search using Supabase pgvector.
 */
export class VectorStore {
  /**
   * @param {import('../embeddings/provider.js').EmbeddingProvider} embeddingProvider
   */
  constructor(embeddingProvider) {
    this.embeddingProvider = embeddingProvider;
  }

  /**
   * Performs a similarity search over disease chunks using pgvector.
   * 
   * @param {string} query - The search query (e.g. "I have a severe headache and fever")
   * @param {Object} options
   * @param {number} [options.limit=5] - Top-k retrieval limit
   * @param {number} [options.threshold=0.5] - Similarity threshold (0 to 1)
   * @param {string} [options.filterType=null] - Metadata filter by chunk_type (e.g. 'symptoms')
   * @returns {Promise<Array<Object>>} Array of matched document chunks
   */
  async semanticSearch(query, options = {}) {
    const limit = options.limit || 5;
    const threshold = options.threshold || 0.5;
    const filterType = options.filterType || null;

    if (!query || typeof query !== 'string') {
      throw new Error('[VectorSearch] Invalid search query.');
    }

    try {
      // 1. Generate embedding for the search query
      const [queryEmbedding] = await this.embeddingProvider.generateEmbeddings([query]);
      
      if (!queryEmbedding) {
        throw new Error('[VectorSearch] Failed to generate embedding for query.');
      }

      // 2. Execute pgvector search via Supabase RPC
      const { data, error } = await supabase.rpc('match_disease_chunks', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit,
        filter_type: filterType
      });

      if (error) {
        throw new Error(`[VectorSearch] Supabase RPC Error: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error('[VectorSearch] Search failed:', err.message);
      throw err;
    }
  }

  /**
   * Helper to store generated chunk embeddings into the pgvector table.
   * 
   * @param {Array<{diseaseId: string, type: string, text: string, embedding: number[]}>} chunksWithEmbeddings
   */
  async storeChunks(chunksWithEmbeddings) {
    if (!chunksWithEmbeddings || chunksWithEmbeddings.length === 0) return;
    
    const rows = chunksWithEmbeddings.map(c => ({
      disease_id: c.diseaseId,
      chunk_type: c.type,
      content: c.text,
      embedding: c.embedding
    }));

    const { error } = await supabase
      .from('disease_chunks')
      .insert(rows);
      
    if (error) {
      throw new Error(`[VectorSearch] Failed to insert chunks: ${error.message}`);
    }
  }
}
