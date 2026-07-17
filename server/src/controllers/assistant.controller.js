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

  const normalized = message.toLowerCase();
  const matched = cannedReplies.find((item) => item.match.some((trigger) => normalized.includes(trigger)));
  const reply = matched ? matched.response : defaultReply;

  return res.status(200).json({
    reply,
    disclaimer: 'This assistant provides educational guidance only and does not replace a medical professional.'
  });
};
