import React from 'react';
import { motion } from 'framer-motion';

export default function SellingNoteCard({ note, onPurchase, user, isPurchased }) {
  const isOwner = user && note.uploader && (user._id === note.uploader._id || user.email === note.uploader.email);
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition flex flex-col justify-between"
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate flex items-center gap-2">
          {note.title}
          {isPurchased && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded bg-green-200 text-green-800 font-bold">Purchased</span>
          )}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
          {note.description}
        </p>
        <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-2">
          ₹{note.price}
        </p>
      </div>
      <div className="p-4 pt-0 flex items-center justify-between">
        {!isOwner ? (
          isPurchased ? (
            <span className="text-xs text-green-500 font-semibold">Already Purchased</span>
          ) : (
            <button
              onClick={onPurchase}
              className="px-5 py-2 rounded-lg bg-green-600 text-white font-bold shadow hover:bg-green-700 transition w-full"
            >
              Purchase
            </button>
          )
        ) : (
          <span className="text-xs text-gray-400">You are the owner</span>
        )}
      </div>
    </motion.div>
  );
}
