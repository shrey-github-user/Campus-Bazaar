import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import api from '../utils/api';
import { showError } from '../components/Common/Toast';
import Loader from '../components/Common/Loader';
import ErrorBoundary from '../components/Common/ErrorBoundary';
import formatDate from '../utils/formatDate';

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/user/purchases');
      setPurchases(res.data.purchases || []);
    } catch {
      showError('Failed to load purchase history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <Layout>
      <ErrorBoundary>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Purchase History</h1>
        {loading ? (
          <Loader text="Loading purchases..." />
        ) : purchases.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No purchases yet.</p>
        ) : (
          <ul className="space-y-3">
            {purchases.map((p, idx) => (
              <li key={idx} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                <p className="font-semibold text-gray-900 dark:text-white">{p.note?.title}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  ₹{p.note?.price} — {formatDate(p.date)}
                </p>
                <a
                  href={p.note?.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </ErrorBoundary>
    </Layout>
  );
}
