import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function ChatMessage({ message }) {
  const { user } = useAuth();
  const isOwn = user && message.sender?._id === user._id;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-lg shadow-md break-words ${
          isOwn
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
        }`}
      >
        {!isOwn && (
          <p className="text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
            {message.sender?.name || 'Anonymous'}
          </p>
        )}
        <p className="text-sm">{message.text}</p>
      </div>
    </motion.div>
  );
}
