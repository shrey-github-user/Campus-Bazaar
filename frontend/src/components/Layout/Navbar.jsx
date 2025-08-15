import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <nav
      className={`backdrop-blur bg-white/80 dark:bg-gray-900/80 shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-30 border-b border-blue-100 dark:border-gray-800 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      aria-label="Main navigation"
    >
      {/* Logo and Project Name */}
      <Link to="/" className="flex items-center gap-3 group" aria-label="Campus Bazaar Home">
  <span className="bg-blue-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-extrabold text-xl shadow-sm group-hover:scale-110 transition-transform">CB</span>
        <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-300 tracking-tight group-hover:text-blue-900 dark:group-hover:text-white transition-colors">Campus Bazaar</span>
      </Link>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {user ? (
          <UserMenu />
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-1.5 text-sm rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition-all"
              aria-label="Login"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-1.5 text-sm rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-100 dark:hover:bg-gray-800 focus:ring-2 focus:ring-blue-400 transition-all"
              aria-label="Signup"
            >
              Signup
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
