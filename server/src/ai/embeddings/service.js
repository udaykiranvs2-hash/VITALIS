import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chunkDisease } from './chunker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROCESSED_DIR = path.join(__dirname, '../knowledge/processed');

/**
 * Service to orchestrate the embedding pipeline.
 * Reads processed disease JSONs, chunks them, generates embeddings via the provider,
 * and passes them to the vector storage layer (pgvector).
 */
export class EmbeddingService {
  /**
   * @param {import('./provider.js').EmbeddingProvider} provider
   */
  constructor(provider) {
    this.provider = provider;
  }

  /**
   * Processes all JSON files in the processed directory.
   * Note: In a full production scenario, you would pass these directly to your Vector DB (pgvector)
   * instead of just returning them, or you would yield them in batches.
   * 
   * @returns {Promise<Array<{diseaseId: string, type: string, text: string, embedding: number[]}>>}
   */
  async processAllKnowledgeBase() {
    console.log('[EmbeddingService] Starting embedding generation for knowledge base...');
    
    const results = [];
    try {
      const entries = await fs.readdir(PROCESSED_DIR, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.json')) {
          const content = await fs.readFile(path.join(PROCESSED_DIR, entry.name), 'utf8');
          const disease = JSON.parse(content);
          
          // 1. Chunk the disease data
          const chunks = chunkDisease(disease);
          if (chunks.length === 0) continue;

          console.log(`[EmbeddingService] Generating embeddings for ${disease.id} (${chunks.length} chunks)`);
          
          // 2. Generate embeddings for all chunks of this disease
          const texts = chunks.map(c => c.text);
          const vectors = await this.provider.generateEmbeddings(texts);

          // 3. Combine chunks with their vectors
          chunks.forEach((chunk, index) => {
            results.push({
              ...chunk,
              embedding: vectors[index]
            });
          });
        }
      }
      
      console.log(`[EmbeddingService] Successfully generated ${results.length} total chunk embeddings.`);
      return results;
      
    } catch (err) {
      console.error('[EmbeddingService] Error processing knowledge base:', err.message);
      throw err;
    }
  }
}
