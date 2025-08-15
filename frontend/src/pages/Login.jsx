// src/pages/Login.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import LoginForm from '../components/Auth/LoginForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [visible, setVisible] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 50);
    if (!loading && user) {
      navigate('/dashboard'); // logged in already
    }
    return () => clearTimeout(timeout);
  }, [loading, user, navigate]);

  return (
    <Layout hideSidebar>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-blue-950 py-8 px-2">
        <div className="w-full max-w-md p-8 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-blue-100 dark:border-gray-800">
          <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700 dark:text-blue-300 tracking-tight">Login to Campus Bazaar</h1>
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
}
