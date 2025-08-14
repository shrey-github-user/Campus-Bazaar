import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function NoteModal({ isOpen, onClose, note, onPurchase }) {
  if (!note) return null;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        {/* Modal Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 translate-y-4 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-4 scale-95"
          >
            <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 animate-fadeIn">
              <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
                {note.title}
              </Dialog.Title>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{note.description}</p>

              {note.isSelling ? (
                <p className="mt-3 font-semibold text-blue-600 dark:text-blue-400">
                  Price: ₹{note.price}
                </p>
              ) : (
                <p className="mt-3 font-semibold text-green-600 dark:text-green-400">
                  Free to Download
                </p>
              )}

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:opacity-80 transition"
                >
                  Close
                </button>
                {note.isSelling ? (
                  <button
                    onClick={() => onPurchase(note._id)}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Purchase
                  </button>
                ) : (
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    Download
                  </a>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
