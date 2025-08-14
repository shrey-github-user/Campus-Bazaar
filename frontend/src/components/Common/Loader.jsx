import React from 'react';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm animate-pulse">{text}</p>
    </div>
  );
}
