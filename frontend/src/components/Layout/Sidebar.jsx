import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuAlt2Icon, XIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 bg-blue-600 text-white rounded-md md:hidden"
      >
        <MenuAlt2Icon className="h-6 w-6" />
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40">
          <div className="absolute left-0 top-0 bg-white dark:bg-gray-900 w-64 h-full shadow-lg p-4">
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 dark:text-gray-300 mb-4"
            >
              <XIcon className="h-5 w-5" />
            </button>
            <nav className="space-y-2">
              <Link to="/" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600">
                Dashboard
              </Link>
              <Link to="/profile" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600">
                Profile
              </Link>
              <Link to="/purchase-history" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600">
                Purchase History
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
