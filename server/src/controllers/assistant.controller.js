import { GoogleGenAI } from '@google/genai';

const disclaimer =
  'This assistant provides educational guidance only and does not replace a medical professional.';

const systemInstruction = `You are Vitalis, a helpful health-information assistant.
Give clear, concise, evidence-informed general wellness guidance. Do not diagnose, prescribe medication, or claim certainty. Encourage a qualified clinician for personalised care. If a user describes possible emergency symptoms (for example chest pain, trouble breathing, stroke signs, severe bleeding, loss of consciousness, or thoughts of self-harm), clearly tell them to seek emergency care immediately. Always include a brief reminder that your answer is informational, not medical advice.`;

export const chat = async (req, res) => {
  const { message, history = [] } = req.body;

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ message: 'Please type a question or topic.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      message: 'AI assistant is not configured. Add GEMINI_API_KEY to server/.env and restart the server.'
    });
  }

  const previousMessages = Array.isArray(history)
    ? history
        .filter(
          (item) =>
            item &&
            ['user', 'assistant'].includes(item.role) &&
            typeof item.message === 'string' &&
            item.message.trim()
        )
        .slice(-10)
        .map((item) => ({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.message.trim() }]
        }))
    : [];

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: [...previousMessages, { role: 'user', parts: [{ text: message.trim() }] }],
      config: {
        systemInstruction,
        temperature: 0.4,
        maxOutputTokens: 700
      }
    });
    const reply = response.text?.trim();

    if (!reply) {
      throw new Error('Gemini returned an empty response.');
    }

    return res.status(200).json({ reply, disclaimer });
  } catch (error) {
    console.error('Gemini assistant request failed:', error.message);
    return res.status(502).json({
      message: 'The AI assistant could not respond right now. Please try again shortly.'
    });
  }
};
