import React from 'react';
import Layout from '../components/Layout/Layout';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Layout>
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Go Home
        </Link>
      </div>
    </Layout>
  );
}
