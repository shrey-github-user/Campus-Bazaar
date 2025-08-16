import React, { useState } from 'react';

export default function SellingNoteModal({ isOpen, onClose, note, onPurchase, user }) {
  const [showPayment, setShowPayment] = useState(false);
  if (!note) return null;

  // Owner check
  let isOwner = false;
  if (user && note.uploader) {
    isOwner = (user._id === note.uploader._id || user.email === note.uploader.email);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fade-in flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">{note?.title}</h2>
        <span className="text-lg font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 px-4 py-1 rounded-full shadow mb-4">Price: ₹{note.price}</span>
        <p className="text-gray-700 dark:text-gray-200 mb-6 whitespace-pre-line">{note?.description}</p>
        {!isOwner ? (
          showPayment ? (
            <div className="flex flex-col items-center w-full">
              <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4">Dummy Payment</h3>
              <p className="mb-4 text-gray-700 dark:text-gray-200">This is a demo payment gateway.<br/>Click below to simulate purchase.</p>
              <button
                onClick={() => { setShowPayment(false); onPurchase(note._id); onClose(); }}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition w-full"
              >
                Pay ₹{note.price}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPayment(true)}
              className="px-5 py-2 rounded-lg bg-green-600 text-white font-bold shadow hover:bg-green-700 transition w-full"
            >
              Purchase
            </button>
          )
        ) : (
          <span className="text-xs text-gray-400">You are the owner</span>
        )}
      </div>
    </div>
  );
}
