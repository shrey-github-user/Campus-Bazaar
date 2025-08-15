import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm';

export default function ForgotPassword() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timeout = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Layout hideSidebar>
      <div
        className={`transition transform duration-300 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <ForgotPasswordForm />
      </div>
    </Layout>
  );
}
