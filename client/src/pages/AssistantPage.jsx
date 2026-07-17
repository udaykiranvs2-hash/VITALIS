import { useState } from 'react';
import { sendAssistantMessage } from '../api/api.js';
import Loader from '../components/Loader.jsx';
import Toast from '../components/Toast.jsx';

function AssistantPage() {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!query.trim()) {
      setToast('Please enter a question or topic.');
      return;
    }
    setLoading(true);
    setToast('');
    const prompt = query.trim();
    try {
      const response = await sendAssistantMessage({ message: prompt });
      setChatHistory((previous) => [
        ...previous,
        { role: 'user', message: prompt },
        { role: 'assistant', message: response.data.reply }
      ]);
      setQuery('');
    } catch {
      setToast('Unable to process your request at the moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feature-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">AI Health Assistant</p>
          <h1>Ask health questions and get practical guidance.</h1>
        </div>
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
      <form className="assistant-form" onSubmit={sendMessage} aria-label="Health assistant chat form">
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask about reports, lifestyle, nutrition, or preventive care."
          rows="4"
          required
        />
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Sending…' : 'Send question'}
        </button>
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
        <p>Disclaimer: The assistant is educational and not a replacement for professional medical advice.</p>
      </div>
    </div>
  );
}

export default AssistantPage;
