
import React from 'react';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-10" role="status" aria-label="Loading">
      <span className="relative flex h-14 w-14">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60"></span>
        <span className="relative inline-flex rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent border-solid animate-spin"></span>
      </span>
      <p className="mt-3 text-gray-700 dark:text-gray-300 text-base animate-pulse font-medium">{text}</p>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
