import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic } from 'lucide-react';
import DOMPurify from 'dompurify'; // Security: XSS Sanitization

const Chatbot = ({ user, role, language }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: `Hello ${user?.displayName?.split(' ')[0] || 'Citizen'}! I'm your Election Assistant. Ask me anything about registering, voting dates, or polling details.`, sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Efficiency: Memoized submit handler
  const handleSend = useCallback(async (e) => {
    e.preventDefault();
    const sanitizedInput = DOMPurify.sanitize(input.trim());
    if (!sanitizedInput) return;

    const userMessage = { id: Date.now(), text: sanitizedInput, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: sanitizedInput, 
          context: 'election-assistant',
          role: role,
          language: language
        })
      });
      
      let botText = "I'm sorry, I couldn't reach the server right now.";
      if (response.ok) {
        const data = await response.json();
        // Security check via DOMPurify despite being plain text from our API
        botText = DOMPurify.sanitize(data.reply);
      }
      
      const botMessage = { id: Date.now() + 1, text: botText, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Connection error. Please try again later.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  }, [input, role, language]);

  return (
    <article className="glass-panel chat-container" aria-labelledby="assistant-title">
      <h3 id="assistant-title">AI Election Assistant</h3>
      
      {/* Accessibility: aria-live ensures screen readers read new messages automatically */}
      <div className="chat-messages" aria-live="polite" aria-atomic="false">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`} tabIndex="0">
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot" aria-label="The assistant is typing">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSend} aria-label="Chat input form">
        <label htmlFor="chat-input-field" className="sr-only" style={{ display: 'none' }}>Type your election question</label>
        <input 
          id="chat-input-field"
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask a question..."
          aria-label="Ask a question..."
          disabled={loading}
          autoComplete="off"
        />
        <button type="submit" className="btn" disabled={loading || !input.trim()} aria-label="Send message">
          <Send size={18} aria-hidden="true" />
        </button>
      </form>
    </article>
  );
};

// Efficiency: Prevent unnecessary re-renders when parent states unrelated to props change
export default React.memo(Chatbot);
