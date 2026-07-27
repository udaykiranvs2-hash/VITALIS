import { useState } from 'react';

const getPreviewReply = (message) => {
  const question = message.toLowerCase();

  if (question.includes('emergency') || question.includes('chest pain') || question.includes('trouble breathing')) {
    return 'If you have chest pain, trouble breathing, fainting, severe bleeding, or other urgent symptoms, please contact local emergency services or visit the nearest emergency department now.';
  }
  if (question.includes('diet') || question.includes('food') || question.includes('nutrition')) {
    return 'For general wellness, try to include vegetables, fruit, whole grains, protein, and water regularly. This is a frontend preview response; your real AI and health data can be connected when the backend is ready.';
  }
  if (question.includes('sleep')) {
    return 'A consistent sleep schedule, a dark quiet room, and limiting caffeine late in the day can support better sleep. This is a frontend preview response.';
  }
  if (question.includes('exercise') || question.includes('workout')) {
    return 'For many people, starting with gentle walking and gradually building activity is a practical approach. Check with a clinician before starting a new plan if you have health concerns. This is a frontend preview response.';
  }

  return 'Your message has been received. This chat is currently running entirely in the frontend, so no information is being sent to a server. Connect your data and AI backend later to provide real personalised responses.';
};

function AssistantPage() {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = (event) => {
    event.preventDefault();
    const prompt = query.trim();
    if (!prompt) return;

    setChatHistory((previous) => [
      ...previous,
      { role: 'user', message: prompt },
      { role: 'assistant', message: getPreviewReply(prompt) }
    ]);
    setQuery('');
  };

  return (
    <div className="feature-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">AI Health Assistant</p>
          <h1>Ask health questions and get practical guidance.</h1>
        </div>
      </div>
      <form className="assistant-form" onSubmit={sendMessage} aria-label="Health assistant chat form">
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask about reports, lifestyle, nutrition, or preventive care."
          rows="4"
          required
        />
        <button type="submit" className="primary-button">Send question</button>
      </form>
      <div className="chat-card">
        {chatHistory.length ? (
          chatHistory.map((entry, index) => (
            <div key={index} className={`chat-bubble ${entry.role}`}>
              <p>{entry.message}</p>
            </div>
          ))
        ) : (
          <p className="empty-state">Start the conversation with your health question.</p>
        )}
      </div>
      <div className="assistant-disclaimer">
        <p>Frontend preview: messages stay in this browser until a backend is connected. This assistant is educational and not a replacement for professional medical advice.</p>
      </div>
    </div>
  );
}

export default AssistantPage;
