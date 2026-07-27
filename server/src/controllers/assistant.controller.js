import { GoogleGenAI } from '@google/genai';

const cannedReplies = [
  {
    match: ['report', 'analysis', 'lab'],
    response: 'I can help explain your report. Share the key readings or upload the report summary, and I will explain what each value means in simple language.'
  },
  {
    match: ['diet', 'nutrition', 'food', 'meal'],
    response: 'A balanced diet includes lean protein, whole grains, vegetables, and healthy fats. I can suggest simple meal ideas based on your goals.'
  },
  {
    match: ['exercise', 'workout', 'fitness'],
    response: 'Regular activity supports overall health. Start with 20-30 minutes of walking, stretching, or bodyweight movement most days of the week.'
  },
  {
    match: ['sleep', 'rest', 'insomnia'],
    response: 'Good sleep hygiene can include a consistent bedtime, limiting screens before bed, and keeping your room cool and comfortable.'
  }
];

const defaultReply = 'I am here to provide general health guidance. Please remember this is informational and not a replacement for professional medical advice.';

const disclaimer =
  'This assistant provides educational guidance only and does not replace a medical professional.';

const systemInstruction = `You are Vitalis, a helpful health-information assistant.
Give clear, concise, evidence-informed general wellness guidance. Do not diagnose, prescribe medication, or claim certainty. Encourage a qualified clinician for personalised care. If a user describes possible emergency symptoms (for example chest pain, trouble breathing, stroke signs, severe bleeding, loss of consciousness, or thoughts of self-harm), clearly tell them to seek emergency care immediately. Always include a brief reminder that your answer is informational, not medical advice.`;

export const chat = async (req, res) => {
  const { message, history = [] } = req.body;

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ message: 'Please type a question or topic.' });
  }

  // If Gemini API Key is available, use live Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
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
      if (reply) {
        return res.status(200).json({ reply, disclaimer });
      }
    } catch (error) {
      console.error('Gemini assistant request failed, falling back to canned response:', error.message);
    }
  }

  // Fallback to local canned replies
  const normalized = message.toLowerCase();
  const matched = cannedReplies.find((item) => item.match.some((trigger) => normalized.includes(trigger)));
  const reply = matched ? matched.response : defaultReply;

  return res.status(200).json({ reply, disclaimer });
};
