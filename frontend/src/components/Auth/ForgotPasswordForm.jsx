import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../Common/Toast';
import api from '../../utils/api';
import getErrorMessage from '../../utils/getErrorMessage';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      showSuccess(res.data.message || 'Password reset link sent!');
    } catch (err) {
      showError(getErrorMessage(err) || 'Failed to send reset link');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`max-w-sm mx-auto mt-12 p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 transition transform duration-300 ease-out
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-2 mb-4 rounded border dark:bg-gray-700 dark:text-white"
        required
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
      >
        {submitting ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  );
}
