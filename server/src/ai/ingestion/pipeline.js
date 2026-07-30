import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateDisease } from '../knowledge/schemas/disease.schema.js';
import { normalizeDiseaseData } from './normalizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_DIR = path.join(__dirname, '../knowledge/raw');
const PROCESSED_DIR = path.join(__dirname, '../knowledge/processed');

/**
 * Ensures the necessary directories exist.
 */
const initializeDirectories = async () => {
  await fs.mkdir(RAW_DIR, { recursive: true });
  await fs.mkdir(PROCESSED_DIR, { recursive: true });
};

/**
 * Reads all JSON files from the raw directory for a specific source.
 * In a real implementation, this could dynamically load adapters based on source.
 * 
 * @param {string} sourceName Optional source name to filter (e.g. 'cdc', 'who')
 * @returns {Promise<Array<Object>>} Array of parsed raw JSON objects
 */
const readRawDocuments = async (sourceName = null) => {
  const rawFiles = [];
  try {
    const entries = await fs.readdir(RAW_DIR, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.json')) {
        // If a specific source is requested, only process matching files (e.g., cdc_flu.json)
        if (sourceName && !entry.name.startsWith(sourceName.toLowerCase())) {
          continue;
        }
        
        const content = await fs.readFile(path.join(RAW_DIR, entry.name), 'utf8');
        try {
          const parsed = JSON.parse(content);
          // Handle both single objects and arrays of objects
          if (Array.isArray(parsed)) {
            rawFiles.push(...parsed);
          } else {
            rawFiles.push(parsed);
          }
        } catch (parseError) {
          console.error(`[Ingestion] Failed to parse JSON in ${entry.name}:`, parseError.message);
        }
      }
    }
  } catch (err) {
    console.error(`[Ingestion] Failed to read raw directory:`, err.message);
  }
  return rawFiles;
};

/**
 * The main ingestion pipeline.
 * Reads raw files -> Normalizes -> Validates -> Removes duplicates -> Writes to processed
 * 
 * @param {string} sourceName Optional source name
 */
export const runIngestionPipeline = async (sourceName = null) => {
  console.log(`[Ingestion] Starting pipeline${sourceName ? ` for source: ${sourceName}` : ''}...`);
  await initializeDirectories();

  const rawDataList = await readRawDocuments(sourceName);
  console.log(`[Ingestion] Found ${rawDataList.length} raw records.`);

  const processedRecords = new Map(); // Use Map to deduplicate by ID
  let successCount = 0;
  let errorCount = 0;

  for (const rawData of rawDataList) {
    try {
      // 1. Normalize Terminology
      const normalizedData = normalizeDiseaseData(rawData);
      
      // 2. Validate against schema
      const validatedData = validateDisease(normalizedData);
      
      // 3. Remove duplicates (last one wins based on ID, or merge logic could go here)
      if (processedRecords.has(validatedData.id)) {
        console.warn(`[Ingestion] Duplicate ID found, overwriting: ${validatedData.id}`);
      }
      processedRecords.set(validatedData.id, validatedData);
      successCount++;
    } catch (err) {
      console.error(`[Ingestion] Validation failed for record ID '${rawData.id || 'unknown'}':`, err.message);
      errorCount++;
    }
  }

  // 4. Save processed JSON
  for (const [id, record] of processedRecords.entries()) {
    const outputPath = path.join(PROCESSED_DIR, `${id}.json`);
    try {
      await fs.writeFile(outputPath, JSON.stringify(record, null, 2), 'utf8');
    } catch (writeErr) {
      console.error(`[Ingestion] Failed to write processed file for ${id}:`, writeErr.message);
    }
  }

  console.log(`[Ingestion] Pipeline complete. Successfully processed: ${successCount}. Errors: ${errorCount}. Unique records saved: ${processedRecords.size}.`);
  return {
    processed: processedRecords.size,
    errors: errorCount
  };
};
