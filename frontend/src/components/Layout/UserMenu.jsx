import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Fragment } from 'react';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    navigate('/login');
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      {/* Menu button */}
      <Menu.Button className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded hover:opacity-80 text-gray-700 dark:text-gray-200 transition">
        {user?.name || 'Account'}
      </Menu.Button>

      {/* Animated dropdown */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-y-2 scale-95"
        enterTo="opacity-100 translate-y-0 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0 scale-100"
        leaveTo="opacity-0 -translate-y-2 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded p-2 z-50 ring-1 ring-black/5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/profile"
                className={`block px-3 py-2 rounded ${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } text-gray-700 dark:text-gray-200 transition`}
              >
                Profile
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/purchase-history"
                className={`block px-3 py-2 rounded ${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } text-gray-700 dark:text-gray-200 transition`}
              >
                Purchase History
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleLogout}
                disabled={loading}
                className={`w-full text-left px-3 py-2 rounded ${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } text-red-500 transition`}
              >
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
