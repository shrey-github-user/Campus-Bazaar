import React, { useState, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { useChat } from '../../context/ChatContext';

export default function ChatWindow() {
  const { messages, sendMessage } = useChat();
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage(text);
    setText('');
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden transition">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
        {messages.map((msg, idx) => (
          <ChatMessage key={msg._id || idx} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex border-t border-gray-300 dark:border-gray-700">
        <input
          type="text"
          className="flex-1 p-3 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none"
          placeholder="Type your message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="px-5 bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
