import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendAssistantMessage } from '../api/api.js';
import { Maximize2, Minimize2, Send, Stethoscope } from 'lucide-react';

function AiChatWidget({ isFullScreen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', message: 'Hello! I am Vitalis. How may I help you?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, loading]);

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
      // Extract page context for the AI
      let pageContext = '';
      const mainContent = document.querySelector('main.app-content');
      if (mainContent) {
        pageContext = mainContent.innerText.substring(0, 2500);
      } else {
        pageContext = document.body.innerText.substring(0, 2500);
      }

      const response = await sendAssistantMessage({
        message: prompt,
        history: chatHistory,
        pageContext: pageContext
      });

      const replyText = response?.data?.reply || 'Received response from assistant.';

      setChatHistory([
        ...updatedHistory,
        { role: 'assistant', message: replyText }
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

  const toggleFullScreen = () => {
    if (isFullScreen) {
      navigate('/app'); // Go back to dashboard if we are full screen and minimize
    } else {
      if (onClose) onClose(); // Close popup if we are in floating mode
      navigate('/app/assistant'); // Navigate to full screen
    }
  };

  return (
    <div className={`ai-chat-widget ${isFullScreen ? 'full-screen-mode' : 'floating-mode'}`}>
      <div className="ai-chat-header">
        <div className="ai-chat-title">
          <Stethoscope size={20} className="ai-header-icon" />
          <span>Vitalis AI</span>
        </div>
        <button type="button" onClick={toggleFullScreen} className="icon-btn" aria-label={isFullScreen ? 'Minimize' : 'Full Screen'}>
          {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      <div className="ai-chat-body">
        {chatHistory.length ? (
          chatHistory.map((entry, index) => (
            <div key={index} className={`chat-bubble ${entry.role}`}>
              <div className="chat-bubble-text" style={{ whiteSpace: 'pre-wrap' }}>
                {entry.message}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>Start a conversation with your health assistant.</p>
          </div>
        )}
        {loading && (
          <div className="chat-bubble assistant loading-bubble">
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        {error && <p className="error-message" style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
        <div ref={chatEndRef} />
      </div>

      <form className="ai-chat-input-area" onSubmit={sendMessage}>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask a health question..."
          disabled={loading}
          autoFocus={!isFullScreen}
        />
        <button type="submit" disabled={!query.trim() || loading} aria-label="Send message">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

export default AiChatWidget;
