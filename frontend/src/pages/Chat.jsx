import React from 'react';
import Layout from '../components/Layout/Layout';
import ChatWindow from '../components/Chat/ChatWindow';

export default function Chat() {
  return (
    <Layout>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Community Chat</h1>
      <ChatWindow />
    </Layout>
  );
}
