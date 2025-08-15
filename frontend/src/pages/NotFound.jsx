import React from 'react';
import Layout from '../components/Layout/Layout';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-blue-950 px-4">
          <span className="text-[7rem] md:text-[10rem] leading-none font-extrabold text-blue-200 dark:text-blue-900 mb-2">😕</span>
          <h1 className="text-6xl font-extrabold text-blue-700 dark:text-blue-300 mb-2 tracking-tight">404</h1>
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6 font-medium">Page Not Found</p>
          <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-all">Go Home</Link>
        </div>
    </Layout>
  );
}
