import { useLocation, useNavigate } from 'react-router-dom';
import { Stethoscope, Sparkles } from 'lucide-react';

function FloatingAiChat() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/dev/assistant' || location.pathname === '/app/assistant') return null;

  return (
    <button type="button" className="floating-ai-chat" onClick={() => navigate('/dev/assistant')} aria-label="Open AI Health Chat">
      <span className="floating-ai-icon"><Stethoscope size={27} strokeWidth={2.2} /></span>
      <span className="floating-ai-label">AI Chat</span>
      <Sparkles className="floating-ai-sparkle" size={15} aria-hidden="true" />
    </button>
  );
}

export default FloatingAiChat;

