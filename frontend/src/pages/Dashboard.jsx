import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import NoteCard from '../components/Notes/NoteCard';
import NoteModal from '../components/Notes/NoteModal';
import UploadModal from '../components/Notes/UploadModal';
import api from '../utils/api';
import { showError, showSuccess } from '../components/Common/Toast';
import Loader from '../components/Common/Loader';
import ErrorBoundary from '../components/Common/ErrorBoundary';
import useDebounce from '../hooks/useDebounce';

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500); // 500ms delay before API call

  const fetchNotes = async (query = '') => {
    setLoading(true);
    try {
      const res = await api.get('/api/notes', {
        params: query ? { q: query } : {}
      });
      setNotes(res.data.notes || []);
    } catch {
      showError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (id) => {
    try {
      await api.post(`/api/notes/purchase/${id}`);
      showSuccess('Note purchased successfully!');
      fetchNotes(debouncedSearch);
    } catch {
      showError('Purchase failed');
    }
  };

  // Initial load
  useEffect(() => {
    fetchNotes();
  }, []);

  // Run search when debounced value changes
  useEffect(() => {
    fetchNotes(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <Layout>
      <ErrorBoundary>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Marketplace</h1>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 rounded border border-gray-300 dark:border-gray-700
                       bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
          />

          <button
            onClick={() => setUploadOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Upload Note
          </button>
        </div>

        {loading ? (
          <Loader text="Loading notes..." />
        ) : notes.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No notes found.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {notes.map(note => (
              <NoteCard key={note._id} note={note} onClick={() => setSelected(note)} />
            ))}
          </div>
        )}

        <NoteModal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          note={selected}
          onPurchase={handlePurchase}
        />

        <UploadModal
          isOpen={uploadOpen}
          onClose={() => setUploadOpen(false)}
          fetchNotes={() => fetchNotes(debouncedSearch)}
        />
      </ErrorBoundary>
    </Layout>
  );
}
