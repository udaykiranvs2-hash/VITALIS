import { GoogleGenAI } from '@google/genai';

const cannedReplies = [
  {
    match: ['bp', 'blood pressure', 'hypertension', 'pressure'],
    response: 'To help manage blood pressure: 1) Reduce sodium/salt intake. 2) Engage in regular moderate physical activity (like 30 minutes of daily walking). 3) Eat a potassium-rich diet (vegetables, bananas, leafy greens). 4) Manage stress through breathing or rest. 5) Avoid smoking and excessive alcohol. If your BP is severely high or accompanied by chest pain, severe headache, or dizziness, seek immediate medical care.'
  },
  {
    match: ['fever', 'temperature', 'chills'],
    response: 'For a mild fever: rest, stay well-hydrated with fluids/water, and wear lightweight clothing. Over-the-counter fever reducers like acetaminophen or ibuprofen can help reduce discomfort. Seek prompt medical evaluation if the fever exceeds 103°F (39.4°C), lasts more than 3 days, or is accompanied by a stiff neck or severe shortness of breath.'
  },
  {
    match: ['headache', 'migraine', 'head pain'],
    response: 'To manage headaches: rest in a quiet, dark room, stay hydrated, apply a cold compress to your forehead, and manage stress. If headaches are sudden, severe ("thunderclap"), or accompanied by fever, confusion, or weakness, seek immediate emergency care.'
  },
  {
    match: ['diabetes', 'sugar', 'glucose'],
    response: 'To help support healthy blood sugar levels: focus on fiber-rich whole foods, limit refined carbohydrates and sugary drinks, stay active after meals, and monitor glucose as recommended by your doctor.'
  },
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

const systemInstruction = `You are Vitalis, an expert AI Health & Medical Assistant. Your role is to provide users with direct, highly accurate, well-structured, and practical medical and wellness information.

When a user asks about any health concern, symptom (such as cold, fever, headache, cough, body pain), condition, report, or lifestyle advice:
1. **Direct Answer / Overview**: Immediately explain what could be causing the issue in clear, easy-to-understand terms.
2. **Key Symptoms & Variations**: Highlight common accompanying symptoms or variations to look out for.
3. **Actionable Self-Care & Home Remedies**: Provide safe, practical, step-by-step guidance (rest, hydration, nutrition, and over-the-counter options where appropriate).
4. **When to Consult a Doctor**: Clearly state red-flag warning signs that require immediate or professional medical attention.

Formatting Rules:
- Structure your response cleanly with clear section headers and bullet points.
- Be thorough, specific, and directly address the user's specific query.
- Never stop mid-sentence; ensure the response is complete and well-rounded.`;

export const chat = async (req, res) => {
  const { message, history = [] } = req.body;

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ message: 'Please type a question or topic.' });
  }

  // If Gemini API Key is available, use live Gemini AI
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
        model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
        contents: [...previousMessages, { role: 'user', parts: [{ text: message.trim() }] }],
        config: {
          systemInstruction,
          temperature: 0.3,
          maxOutputTokens: 1500
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
