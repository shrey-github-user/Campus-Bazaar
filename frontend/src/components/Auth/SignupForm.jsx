import React, { useState, useEffect } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import validateEmail from '../../utils/validateEmail'; // ✅ import helper

export default function SignupForm() {
  const { signup, user, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    university: '',
    universityId: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50); // animation
    if (!loading && user) navigate('/');
  }, [loading, user, navigate]);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();

    // ✅ Frontend email validation before API call
    if (!validateEmail(form.email)) {
      toast.error('Email must end with .ac.in or .in');
      return;
    }

    setSubmitting(true);
    const res = await signup(form);
    setSubmitting(false);

    if (res.success) {
      toast.success(res.message || 'Signup successful! Please verify your email.');
      navigate('/login');
    } else {
      toast.error(res.error || 'Signup failed');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`max-w-sm mx-auto mt-8 p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 
      transition transform duration-300 ease-out
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
        Signup
      </h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full p-2 mb-3 rounded border dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="University Email"
        type="email"
        className="w-full p-2 mb-3 rounded border dark:bg-gray-700 dark:text-white"
        required
      />
      <div className="relative mb-3">
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
      <input
        name="university"
        value={form.university}
        onChange={handleChange}
        placeholder="University Name"
        className="w-full p-2 mb-3 rounded border dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        name="universityId"
        value={form.universityId}
        onChange={handleChange}
        placeholder="University ID"
        className="w-full p-2 mb-4 rounded border dark:bg-gray-700 dark:text-white"
        required
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
      >
        {submitting ? 'Signing up…' : 'Signup'}
      </button>

      <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
