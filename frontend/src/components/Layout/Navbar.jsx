import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for animation
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 50); // small delay for smoothness
    return () => clearTimeout(timeout);
  }, []);

  return (
    <nav
      className={`flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 shadow-sm 
      transition-colors duration-300 transform transition-transform ease-out 
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
    >
      {/* Project Name */}
      <Link
        to="/"
        className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition"
      >
        Campus Bazaar
      </Link>

      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User actions */}
        {user ? (
          <UserMenu />
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-1 text-sm rounded border border-blue-600 text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-800 transition"
            >
              Signup
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
