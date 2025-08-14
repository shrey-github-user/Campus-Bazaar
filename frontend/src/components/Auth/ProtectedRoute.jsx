import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-8 text-gray-700 dark:text-gray-300">Checking authentication...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
