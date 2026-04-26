import { useState, useCallback } from 'react';
import DOMPurify from 'dompurify';

/**
 * Custom hook to encapsulate and manage Chatbot state and API communication.
 * Enhances Code Quality by decoupling logic from the UI.
 */
export const useChat = (user, role, language) => {
  const [messages, setMessages] = useState([
    { id: 1, text: `Hello ${user?.displayName?.split(' ')[0] || 'Citizen'}! I'm your Election Assistant. Ask me anything.`, sender: 'bot' }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (input) => {
    const sanitizedInput = DOMPurify.sanitize(input.trim());
    if (!sanitizedInput) return;

    const userMessage = { id: Date.now(), text: sanitizedInput, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: sanitizedInput, context: 'election-assistant', role, language })
      });
      
      let botText = "I'm sorry, I couldn't reach the server right now.";
      if (response.ok) {
        const data = await response.json();
        botText = DOMPurify.sanitize(data.reply);
      }
      
      const botMessage = { id: Date.now() + 1, text: botText, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Connection error. Please try again later.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  }, [role, language]);

  return { messages, loading, sendMessage };
};
