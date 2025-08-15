import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import api from '../utils/api';

const ChatContext = createContext();


// Helper to get socket URL for production and development
function getSocketUrl() {
  if (process.env.NODE_ENV === 'production') {
    // In production, use same origin (no CORS needed)
    return undefined;
  }
  return process.env.REACT_APP_API_URL || 'http://localhost:5000';
}

let socketInstance = null;

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  // Ensure only one socket connection is created
  if (!socketInstance) {
    socketInstance = io(getSocketUrl(), {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      withCredentials: true
    });
    socketInstance.on('connect', () => {
      console.log('[ChatContext] Socket connected:', socketInstance.id);
    });
  }
  socketRef.current = socketInstance;


  // Fetch existing chat only once on mount
  useEffect(() => {
    api.get('/api/chat')
      .then(res => {
        setMessages(res.data.messages || []);
        console.log('[ChatContext] Initial messages loaded:', res.data.messages);
      })
      .catch((err) => {
        console.error('[ChatContext] Failed to load messages', err);
      });
  }, []);

  // Listen for new socket messages and append if not duplicate
  useEffect(() => {
    const handleReceive = (msg) => {
      console.log('[ChatContext] Received message via socket:', msg);
      setMessages(prev => {
        if (prev.some(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };
    socketRef.current.on('receiveMessage', handleReceive);
    return () => {
      socketRef.current.off('receiveMessage', handleReceive);
    };
  }, []);

  const sendMessage = async (text) => {
    try {
      const res = await api.post('/api/chat', { text });
      console.log('[ChatContext] Sent message to backend, emitting via socket:', res.data.data);
      socketRef.current.emit('sendMessage', res.data.data);
    } catch (err) {
      console.error('[ChatContext] Failed to send message', err);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
