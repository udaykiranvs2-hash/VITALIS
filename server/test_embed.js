import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI } from '@google/genai';

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    // Try old SDK approach if genai fails, actually just use standard fetch to list models
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await res.json();
    const embeddingModels = data.models.filter(m => m.name.includes('embed'));
    console.log('Available embedding models:');
    embeddingModels.forEach(m => console.log(m.name, m.supportedGenerationMethods));
  } catch (err) {
    console.error('Error:', err.message);
  }
}
test();
