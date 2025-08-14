import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { showSuccess, showError } from '../components/Common/Toast';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/api/auth/verify-email/${token}`);
        setStatus(res.data.message || 'Email verified successfully!');
        showSuccess('Email verified! You can log in now.');
      } catch (err) {
        setStatus(err.response?.data?.message || 'Verification failed');
        showError('Verification failed');
      }
    };
    verify();
  }, [token]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{status}</h1>
        <Link to="/login" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Go to Login
        </Link>
      </div>
    </Layout>
  );
}
