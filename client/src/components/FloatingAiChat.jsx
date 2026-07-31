import { useEffect, useMemo, useRef, useState } from 'react';
import { Stethoscope, Sparkles, Send, X, Mic, Paperclip, ShieldCheck, Bot, User, Maximize2, Minimize2 } from 'lucide-react';
import { sendAssistantMessage } from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import './FloatingAiChat.css';

const starterSuggestions = [
  'What should I do for a mild fever?',
  'Help me understand my blood pressure readings',
  'Suggest foods for better heart health',
  'How can I sleep better at night?'
];

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function humanizeDelay(min = 420, max = 850) {
  return min + Math.floor(Math.random() * (max - min));
}

function parseAssistantMarkdownLike(text) {
  if (!text) return '';
  return String(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(?:\r\n|\r|\n)/g, '<br/>')
    .replace(/(^\d+\)\s)/gm, '<br/>$1');
}

export default function FloatingAiChat() {
  const { user, openLoginModal } = useAuth();
  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [closing, setClosing] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('vitalis_chat_history');
      if (saved) return JSON.parse(saved);
    } catch (_) {
      /* ignore */
    }
    return [
      {
        id: 'welcome',
        role: 'assistant',
        message:
          "Hi, I'm your VITALIS AI health assistant. I can explain symptoms, give simple self-care guidance, help you prep questions for your doctor, and more. How can I help you today?",
        timestamp: Date.now()
      }
    ];
  });

  const chatScrollRef = useRef(null);
  const textareaRef = useRef(null);
  const openingTimer = useRef(null);
  const closingTimer = useRef(null);

  // Persist chat
  useEffect(() => {
    try {
      localStorage.setItem('vitalis_chat_history', JSON.stringify(messages.slice(-50)));
    } catch (_) {
      /* ignore */
    }
  }, [messages]);

  // Scroll to bottom whenever messages / loading changes
  useEffect(() => {
    const el = chatScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  // Focus textarea when chat opens
  useEffect(() => {
    if (open && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 280);
    }
  }, [open]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && fullScreen) setFullScreen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [fullScreen]);

  const sendMessage = async (rawText = '') => {
    const text = (rawText || input || '').trim();
    if (!text || loading) return;
    if (!user) {
      openLoginModal();
      return;
    }
    setErrorMsg('');
    setInput('');

    const userMsg = { id: uid(), role: 'user', message: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const historyForApi = messages
      .filter((m) => m.id !== 'welcome' || messages.length <= 1)
      .map((m) => ({ role: m.role, message: m.message }));

    try {
      const res = await sendAssistantMessage({ message: text, history: historyForApi });
      const reply = res?.data?.reply || res?.reply || "Hmm, I wasn't able to answer that right now.";

      // Artificial typing delay so transition feels natural
      await new Promise((r) => setTimeout(r, humanizeDelay(500, 950)));

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'assistant',
          message: reply,
          disclaimer: res?.data?.disclaimer || res?.disclaimer,
          timestamp: Date.now()
        }
      ]);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "I couldn't reach VITALIS right now — please try again in a moment.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    if (closingTimer.current) clearTimeout(closingTimer.current);
    if (openingTimer.current) clearTimeout(openingTimer.current);

    if (!open) {
      setOpening(true);
      setClosing(false);
      setOpen(true);
      openingTimer.current = setTimeout(() => setOpening(false), 420);
    } else {
      setFullScreen(false);
      setClosing(true);
      closingTimer.current = setTimeout(() => {
        setOpen(false);
        setClosing(false);
      }, 300);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const panelClass = useMemo(() => {
    const parts = ['ai-chat-panel'];
    if (open) parts.push('is-open');
    if (opening) parts.push('is-opening');
    if (closing) parts.push('is-closing');
    if (fullScreen) parts.push('is-fullscreen');
    return parts.join(' ');
  }, [open, opening, closing, fullScreen]);

  const buttonClass = useMemo(() => {
    const parts = ['floating-ai-chat'];
    if (open) parts.push('is-open');
    if (opening) parts.push('is-opening');
    if (closing) parts.push('is-closing');
    return parts.join(' ');
  }, [open, opening, closing]);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        type="button"
        className={buttonClass}
        onClick={toggle}
        aria-label={open ? 'Close AI Health Chat' : 'Open AI Health Chat'}
        aria-expanded={open}
      >
        <span className="floating-ai-icon">
          {open ? <X size={20} strokeWidth={2.4} /> : <Stethoscope size={27} strokeWidth={2.2} />}
        </span>
        <span className="floating-ai-label">{open ? 'Close' : 'AI Chat'}</span>
        {!open && <Sparkles className="floating-ai-sparkle" size={15} aria-hidden="true" />}
        {!open && <span className="floating-ai-ping" aria-hidden="true" />}
      </button>

      {/* Chat Panel */}
      <div
        className={panelClass}
        role="dialog"
        aria-label="VITALIS AI Health Chat"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-chat-header-left">
            <div className="ai-chat-avatar">
              <Bot size={22} />
              <span className="ai-chat-status-dot" aria-hidden="true" />
            </div>
            <div className="ai-chat-header-text">
              <h3>VITALIS AI</h3>
              <p>Always here to help</p>
            </div>
          </div>
          <div className="ai-chat-header-actions">
            <button type="button" className="ai-chat-fullscreen" onClick={() => setFullScreen((value) => !value)} aria-label={fullScreen ? 'Exit fullscreen' : 'Open fullscreen'} title={fullScreen ? 'Exit fullscreen' : 'Fullscreen'}>
              {fullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button type="button" className="ai-chat-close" onClick={toggle} aria-label="Close chat"><X size={18} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="ai-chat-messages" ref={chatScrollRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`ai-chat-msg ${msg.role === 'user' ? 'is-user' : 'is-assistant'}`}
            >
              <div className="ai-chat-msg-avatar">
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="ai-chat-msg-body">
                <div
                  className="ai-chat-msg-bubble"
                  dangerouslySetInnerHTML={{
                    __html: parseAssistantMarkdownLike(msg.message)
                  }}
                />
                {msg.role === 'assistant' && msg.disclaimer && (
                  <p className="ai-chat-disclaimer">
                    <ShieldCheck size={13} /> {msg.disclaimer}
                  </p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="ai-chat-msg is-assistant ai-chat-typing-row">
              <div className="ai-chat-msg-avatar">
                <Bot size={16} />
              </div>
              <div className="ai-chat-msg-body">
                <div className="ai-chat-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}

          {errorMsg && !loading && (
            <div className="ai-chat-error">⚠ {errorMsg}</div>
          )}

          {!loading &&
            !errorMsg &&
            messages.length <= 1 &&
            messages[0]?.id === 'welcome' && (
              <div className="ai-chat-suggestions">
                {starterSuggestions.map((s) => (
                  <button
                    type="button"
                    key={s}
                    className="ai-chat-suggestion-chip"
                    onClick={() => sendMessage(s)}
                  >
                    <Sparkles size={14} /> {s}
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* Input */}
        <form
          className="ai-chat-input-wrap"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <button
            type="button"
            className="ai-chat-attach"
            aria-label="Attach file"
            title="Attach (coming soon)"
            onClick={() => alert('Attachment support coming soon!')}
          >
            <Paperclip size={16} />
          </button>
          <textarea
            ref={textareaRef}
            className="ai-chat-input"
            placeholder={user ? 'Ask about symptoms, diet, sleep, reports…' : 'Log in to chat with VITALIS AI'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            disabled={loading}
          />
          <button
            type="button"
            className="ai-chat-mic"
            aria-label="Voice input"
            title="Voice input (coming soon)"
            onClick={() => alert('Voice input coming soon!')}
          >
            <Mic size={16} />
          </button>
          <button
            type="submit"
            className="ai-chat-send"
            disabled={loading || !input.trim() || !user}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </>
  );
}
