import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import api from '../utils/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

  // Fetch existing chat
  useEffect(() => {
    api.get('/api/chat')
      .then(res => setMessages(res.data.messages || []))
      .catch(() => {});
  }, []);

  // Listen for new socket messages
  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => socket.disconnect();
  }, [socket]);

  const sendMessage = async (text) => {
    const res = await api.post('/api/chat', { text });
    socket.emit('sendMessage', res.data.message);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
