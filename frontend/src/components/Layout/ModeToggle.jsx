import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Switch } from '@headlessui/react';

export default function ModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={theme === 'dark'}
        onChange={toggleTheme}
        className={`${
          theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
        } relative inline-flex h-6 w-12 items-center rounded-full transition-colors`}
      >
        <span
          className={`${
            theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </div>
  );
}
