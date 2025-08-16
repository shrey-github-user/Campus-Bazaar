import React, { useState } from 'react';

export default function NoteModal({ isOpen, onClose, note, onPurchase, user, onDelete, showPayment }) {
  const [internalShowPayment, setInternalShowPayment] = useState(false);
  if (!note) return null;

  // Fix: Use correct property for selling mode
  const isSelling = note.isSelling !== undefined ? note.isSelling : note.mode === 'selling';
  const fileUrl = note.fileUrl?.startsWith('http')
    ? note.fileUrl
    : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${note.fileUrl}`;

  let isOwner = false;
  if (user && note.uploader) {
    isOwner = (user._id === note.uploader._id || user.email === note.uploader.email);
  }

  const showPaymentFinal = showPayment || internalShowPayment;

  // Prepare the content based on selling/owner status
  let contentSection;

  if (isSelling && !isOwner) {
    // Selling and not owner → price + purchase/payment
    contentSection = (
      <>
        <span className="text-lg font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 px-4 py-1 rounded-full shadow mb-4">
          Price: ₹{note.price}
        </span>
        {showPaymentFinal ? (
          <div className="flex flex-col items-center w-full">
            <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4">Dummy Payment</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-200">
              This is a demo payment gateway.<br />Click below to simulate purchase.
            </p>
            <button
              onClick={() => { setInternalShowPayment(false); onPurchase(note._id); onClose(); }}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition w-full"
            >
              Pay ₹{note.price}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setInternalShowPayment(true)}
            className="px-5 py-2 rounded-lg bg-green-600 text-white font-bold shadow hover:bg-green-700 transition w-full"
          >
            Purchase
          </button>
        )}
      </>
    );
  } else {
    // Owner or not selling → view/download buttons
    contentSection = (
      <>
        {isSelling && (
          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 px-4 py-1 rounded-full shadow">
              Price: ₹{note.price}
            </span>
          </div>
        )}
        {fileUrl && (
          <div className="flex gap-3">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            >
              View
            </a>
            <a
              href={fileUrl}
              download
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
            >
              Download
            </a>
          </div>
        )}
        {isOwner && (
          <button
            onClick={() => onDelete(note._id)}
            className="mt-6 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
          >
            Delete Note
          </button>
        )}
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">{note?.title}</h2>
        <p className="text-gray-700 dark:text-gray-200 mb-6 whitespace-pre-line">{note?.description}</p>

        {contentSection}
      </div>
    </div>
  );
}
