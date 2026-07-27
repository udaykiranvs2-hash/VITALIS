import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

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

export const chat = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'Please type a question or topic.' });
  }

  if (ai) {
    try {
      const prompt = `Act as Vitalis' virtual AI health assistant. You are chatting with a user.
User Message: "${message}"

Task:
1. Provide a professional, compassionate, clear, and informative response to the user's question.
2. Ensure you provide helpful general health education/guidance, but never diagnose, prescribe, or provide clinical treatment plans.
3. If they ask about symptoms or medical issues, suggest they check their symptoms using the Vitalis Symptom Checker page or seek care from a primary care provider.
4. Include a concise medical educational disclaimer.

You MUST respond strictly in JSON format. The response schema must be:
{
  "reply": "Your response here...",
  "disclaimer": "This assistant provides educational guidance only and does not replace a medical professional."
}

JSON Response:`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text.trim());
      if (parsed.reply) {
        return res.status(200).json({
          reply: parsed.reply,
          disclaimer: parsed.disclaimer || 'This assistant provides educational guidance only and does not replace a medical professional.'
        });
      }
    } catch (error) {
      console.error('Gemini Assistant Chat Error, falling back to mock:', error.message);
    }
  }

  const normalized = message.toLowerCase();
  const matched = cannedReplies.find((item) => item.match.some((trigger) => normalized.includes(trigger)));
  const reply = matched ? matched.response : defaultReply;

  return res.status(200).json({
    reply,
    disclaimer: 'This assistant provides educational guidance only and does not replace a medical professional.'
  });
};
