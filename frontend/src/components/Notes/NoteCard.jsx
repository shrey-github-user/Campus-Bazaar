import React from 'react';
import { motion } from 'framer-motion';

export default function NoteCard({ note, onClick, user }) {
  const isOwner = user && note.uploader && (user._id === note.uploader._id || user.email === note.uploader.email);
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition"
      onClick={onClick}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
          {note.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {note.description}
        </p>
        {note.isSelling && !isOwner && (
          <p className="mt-2 text-blue-600 dark:text-blue-400 font-semibold">
            ₹{note.price}
          </p>
        )}
      </div>
    </motion.div>
  );
}
