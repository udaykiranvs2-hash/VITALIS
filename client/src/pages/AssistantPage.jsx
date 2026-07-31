import { useState } from 'react';
import { sendAssistantMessage } from '../api/api.js';

function AssistantPage() {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async (event) => {
    event.preventDefault();
    const prompt = query.trim();
    if (!prompt || loading) return;

    const userEntry = { role: 'user', message: prompt };
    const updatedHistory = [...chatHistory, userEntry];

    setChatHistory(updatedHistory);
    setQuery('');
    setLoading(true);
    setError('');

    try {
      const response = await sendAssistantMessage({
        message: prompt,
        history: chatHistory
      });

      const replyText = response?.data?.reply || 'Received response from assistant.';
      const disclaimerText = response?.data?.disclaimer;

      setChatHistory([
        ...updatedHistory,
        { role: 'assistant', message: replyText, disclaimer: disclaimerText }
      ]);
    } catch (err) {
      console.error('Assistant API error:', err);
      const errorMsg = err?.response?.data?.message || 'Unable to process your request at the moment. Please try again.';
      setError(errorMsg);
      setChatHistory([
        ...updatedHistory,
        { role: 'assistant', message: `⚠️ ${errorMsg}` }
      ]);
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
      <form className="assistant-form" onSubmit={sendMessage} aria-label="Health assistant chat form">
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask about reports, lifestyle, nutrition, or preventive care."
          rows="4"
          disabled={loading}
          required
        />
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Thinking...' : 'Send question'}
        </button>
      </form>
      {error && <p className="error-message" style={{ color: '#ef4444', marginTop: '10px' }}>{error}</p>}
      <div className="chat-card">
        {chatHistory.length ? (
          chatHistory.map((entry, index) => (
            <div key={index} className={`chat-bubble ${entry.role}`}>
              <div className="chat-bubble-text" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem' }}>
                {entry.message}
              </div>
              {entry.disclaimer && (
                <span className="disclaimer-subtext" style={{ display: 'block', fontSize: '11px', color: '#6b7280', marginTop: '8px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '4px' }}>
                  {entry.disclaimer}
                </span>
              )}
            </div>
          ))
        ) : (
          <p className="empty-state">Start the conversation with your health question.</p>
        )}
      </div>
      <div className="assistant-disclaimer">
        <p>This AI health assistant provides educational guidance only and is not a replacement for professional medical advice.</p>
      </div>
    </div>
  );
}

export default AssistantPage;
