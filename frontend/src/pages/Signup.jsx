import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import SignupForm from '../components/Auth/SignupForm';

export default function Signup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Layout>
      <div
        className={`transition transform duration-300 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <SignupForm />
      </div>
    </Layout>
  );
}
