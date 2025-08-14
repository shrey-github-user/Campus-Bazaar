import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import ChatMessage from './ChatMessage';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch existing messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get('/api/chat');
        setMessages(res.data.messages || []);
      } catch (err) {
        toast.error('Failed to load chat history');
      }
    };
    fetchMessages();
  }, []);

  // Socket listener for new messages
  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      // Send to backend
      const res = await api.post('/api/chat', { text });
      // Emit to all sockets
      socket.emit('sendMessage', res.data.message);
      setText('');
    } catch {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden transition">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex border-t border-gray-300 dark:border-gray-700">
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
