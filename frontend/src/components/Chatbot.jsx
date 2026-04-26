import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../hooks/useChat';

const Chatbot = ({ user, role, language }) => {
  const { messages, loading, sendMessage } = useChat(user, role, language);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };

  return (
    <article className="glass-panel chat-container" aria-labelledby="assistant-title">
      <h3 id="assistant-title">AI Election Assistant</h3>
      
      {/* High-visibility active reading zone for a11y */}
      <div className="chat-messages" aria-live="polite" aria-atomic="false" role="log">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`} tabIndex="0">
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot" aria-label="The assistant is typing">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSubmit} aria-label="Chat input form">
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

export default React.memo(Chatbot);
