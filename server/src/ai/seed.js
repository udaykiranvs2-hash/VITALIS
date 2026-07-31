import dotenv from 'dotenv';
dotenv.config();

import { runIngestionPipeline } from './ingestion/pipeline.js';
import { createLLMProvider } from './llm/factory.js';
import { GeminiEmbeddingProvider } from './embeddings/provider.js';
import { EmbeddingService } from './embeddings/service.js';
import { VectorStore } from './vector/search.js';

async function runSeeder() {
  console.log('--- VITALIS AI KNOWLEDGE BASE SEEDER ---');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('ERROR: GEMINI_API_KEY is not set in your .env file.');
    process.exit(1);
  }

  try {
    // 1. Initialize Ingestion Pipeline
    await runIngestionPipeline();

    // 2. Initialize Embeddings & Vector Store
    const embeddingProvider = new GeminiEmbeddingProvider(process.env.GEMINI_API_KEY);
    const vectorStore = new VectorStore(embeddingProvider);
    const embeddingService = new EmbeddingService(embeddingProvider);

    // 3. Process processed JSONs into Vectors
    const chunksWithEmbeddings = await embeddingService.processAllKnowledgeBase();
    
    if (chunksWithEmbeddings.length > 0) {
      console.log(`\n[Seeder] Uploading ${chunksWithEmbeddings.length} chunks to Supabase pgvector...`);
      await vectorStore.storeChunks(chunksWithEmbeddings);
      console.log('[Seeder] Upload complete! The AI is now powered with your medical data.');
    } else {
      console.log('[Seeder] No chunks were generated. Is the raw/ directory empty?');
    }

  } catch (error) {
    console.error('\n[Seeder] Fatal Error during seeding:', error.message);
  }
}

runSeeder();
