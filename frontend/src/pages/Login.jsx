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
    <Layout>
      <div
        className={`flex justify-center items-center py-10 transition transform duration-300 ease-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <LoginForm />
      </div>
    </Layout>
  );
}
