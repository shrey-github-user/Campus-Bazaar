import React, { useState, useEffect } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { showSuccess, showError } from '../Common/Toast';
import Loader from '../Common/Loader';

export default function LoginForm() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
    if (!loading && user) navigate('/');
  }, [loading, user, navigate]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(form.email, form.password);
    setSubmitting(false);
    if (res.success) {
      showSuccess('Login successful!');
      navigate('/');
    } else {
      showError(res.error || 'Login failed');
    }
  };

  if (loading) return <Loader text="Checking authentication..." />;

  return (
    <form
      onSubmit={handleSubmit}
      className={`max-w-sm mx-auto mt-12 p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 transition transform duration-300 ease-out
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Login</h2>
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="University Email"
        type="email"
        className="w-full p-2 mb-3 rounded border dark:bg-gray-700 dark:text-white"
        required
      />
      <div className="relative mb-4">
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white pr-10"
          required
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
        </button>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
      >
        {submitting ? 'Logging in…' : 'Login'}
      </button>
      <div className="mt-3 text-sm flex justify-between">
        <Link to="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">
          Forgot Password?
        </Link>
        <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
          Sign up
        </Link>
      </div>
    </form>
  );
}
