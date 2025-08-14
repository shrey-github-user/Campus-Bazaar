import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5 text-yellow-400 transition-transform duration-300 transform rotate-0 hover:rotate-12" />
      ) : (
        <MoonIcon className="h-5 w-5 transition-transform duration-300 transform rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}
