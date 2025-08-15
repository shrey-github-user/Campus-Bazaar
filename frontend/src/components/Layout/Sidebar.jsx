import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiHome, HiDocumentText, HiChatAlt2, HiUserCircle, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

const navItems = [
  { to: '/dashboard', label: 'Home', icon: <HiHome size={22} /> },
  { to: '/notes', label: 'Notes', icon: <HiDocumentText size={22} /> },
  { to: '/chat', label: 'Chat', icon: <HiChatAlt2 size={22} /> },
  { to: '/profile', label: 'Profile', icon: <HiUserCircle size={22} /> },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false); // mobile
  const [collapsed, setCollapsed] = useState(true); // desktop, always collapsed by default
  const location = useLocation();

  // Mobile sidebar
  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 bg-blue-600 text-white rounded-md md:hidden fixed top-20 left-3 z-40 shadow-lg"
        aria-label="Open sidebar"
      >
        <HiOutlineMenu className="h-6 w-6" />
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40">
          <div className="absolute left-0 top-0 bg-white dark:bg-gray-900 w-64 h-full shadow-lg p-4 flex flex-col">
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 dark:text-gray-300 mb-4 self-end"
              aria-label="Close sidebar"
            >
              <HiOutlineX className="h-6 w-6" />
            </button>
            <nav className="flex flex-col gap-2 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-800 transition-all group ${location.pathname.startsWith(item.to) ? 'bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-300 font-bold shadow' : ''}`}
                  aria-current={location.pathname.startsWith(item.to) ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex h-full ${collapsed ? 'w-20' : 'w-56'} bg-white/80 dark:bg-gray-900/80 border-r border-blue-100 dark:border-gray-800 shadow-sm flex-col py-6 px-3 gap-2 sticky top-16 z-20 min-h-[calc(100vh-4rem)] transition-all duration-300`}> 
        {/* Collapse/Expand button */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="mb-6 ml-1 p-2 rounded-md hover:bg-blue-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400 transition self-start"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <HiOutlineMenu className="h-6 w-6" />
        </button>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-800 transition-all group ${location.pathname.startsWith(item.to) ? 'bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-300 font-bold shadow' : ''}`}
              aria-current={location.pathname.startsWith(item.to) ? 'page' : undefined}
              onClick={() => setCollapsed(true)}
            >
              <span className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">{item.icon}</span>
              {!collapsed && item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
