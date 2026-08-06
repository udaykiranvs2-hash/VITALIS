import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Stethoscope, Sparkles, X } from 'lucide-react';
import AiChatWidget from './AiChatWidget.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function FloatingAiChat() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  if (!user || location.pathname === '/dev/assistant' || location.pathname === '/app/assistant') return null;

  return (
    <div className="floating-ai-container">
      {isOpen && (
        <div className="floating-ai-popover">
          <AiChatWidget isFullScreen={false} onClose={() => setIsOpen(false)} />
        </div>
      )}
      
      <button 
        type="button" 
        className={`floating-ai-button ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)} 
        aria-label={isOpen ? "Close AI Health Chat" : "Open AI Health Chat"}
      >
        {isOpen ? (
          <X size={27} strokeWidth={2.2} className="floating-ai-icon" />
        ) : (
          <>
            <span className="floating-ai-icon"><Stethoscope size={27} strokeWidth={2.2} /></span>
            <span className="floating-ai-label">AI Chat</span>
            <Sparkles className="floating-ai-sparkle" size={15} aria-hidden="true" />
          </>
        )}
      </button>
    </div>
  );
}

export default FloatingAiChat;
