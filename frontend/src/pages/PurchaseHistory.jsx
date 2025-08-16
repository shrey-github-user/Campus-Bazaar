import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import api from '../utils/api';
import { showError } from '../components/Common/Toast';
import getErrorMessage from '../utils/getErrorMessage';
import Loader from '../components/Common/Loader';
import ErrorBoundary from '../components/Common/ErrorBoundary';
import formatDate from '../utils/formatDate';
import axios from 'axios';

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/user/purchases');
      setPurchases(res.data.purchases || []);
    } catch (err) {
      showError(getErrorMessage(err) || 'Failed to load purchase history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  // Download handler for protected files
  const handleDownload = async (noteId, fallbackFileName) => {
    try {
      // Step 1: Get authorized file URL from backend
      const res = await api.post(`/api/notes/download/${noteId}`);
      const { fileUrl, fileName } = res.data;
      const url = fileUrl.startsWith('http') ? fileUrl : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${fileUrl}`;
      // Step 2: Download the file as blob
      const fileRes = await axios.get(url, { responseType: 'blob' });
      const blob = new Blob([fileRes.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName || fallbackFileName || 'note.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      showError('Download failed.');
    }
  };

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
                <button
                  onClick={() => handleDownload(p.note?._id, p.note?.title || 'note.pdf')}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </ErrorBoundary>
    </Layout>
  );
}
