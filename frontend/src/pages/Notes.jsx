import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import NoteCard from '../components/Notes/NoteCard';
import NoteModal from '../components/Notes/NoteModal';
import UploadSharingModal from '../components/Notes/UploadSharingModal';
import UploadSellingModal from '../components/Notes/UploadSellingModal';
import api from '../utils/api';
import { showError, showSuccess } from '../components/Common/Toast';
import getErrorMessage from '../utils/getErrorMessage';
import Loader from '../components/Common/Loader';
import ErrorBoundary from '../components/Common/ErrorBoundary';
import useDebounce from '../hooks/useDebounce';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [uploadSharingOpen, setUploadSharingOpen] = useState(false);
  const [uploadSellingOpen, setUploadSellingOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Read mode from query string
  const getInitialMode = () => {
    const params = new URLSearchParams(location.search);
    const m = params.get('mode');
    return m === 'selling' ? 'selling' : 'sharing';
  };
  const [mode, setMode] = useState(getInitialMode());
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  // Keep mode in sync with query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const m = params.get('mode');
    if ((m === 'selling' && mode !== 'selling') || (m === 'sharing' && mode !== 'sharing')) {
      setMode(m);
    }
  }, [location.search]);

  const fetchNotes = async (query = '') => {
    setLoading(true);
    try {
      const res = await api.get('/api/notes', {
        params: { q: query, mode }
      });
      setNotes(res.data.notes || []);
    } catch (err) {
      showError(getErrorMessage(err) || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (id) => {
    try {
      await api.post(`/api/notes/purchase/${id}`);
      showSuccess('Note purchased successfully!');
      fetchNotes(debouncedSearch);
    } catch (err) {
      showError(getErrorMessage(err) || 'Purchase failed');
    }
  };

  useEffect(() => {
    fetchNotes(debouncedSearch);
    // eslint-disable-next-line
  }, [mode]);

  useEffect(() => {
    fetchNotes(debouncedSearch);
    // eslint-disable-next-line
  }, [debouncedSearch]);

  return (
    <Layout>
      <ErrorBoundary>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 dark:text-blue-300 tracking-tight mb-1">Notes</h1>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              {mode === 'selling'
                ? 'Discover, upload, and purchase notes with ease!'
                : 'Find, upload, and freely share notes with your campus community!'}
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center w-full md:w-auto">
            <div className="flex items-center gap-2 mb-2 md:mb-0">
              <button
                type="button"
                aria-pressed={mode === 'selling'}
                onClick={() => {
                  const newMode = mode === 'sharing' ? 'selling' : 'sharing';
                  setMode(newMode);
                  const params = new URLSearchParams(location.search);
                  params.set('mode', newMode);
                  navigate({ search: params.toString() }, { replace: true });
                }}
                className="relative flex w-48 h-14 bg-gray-200 dark:bg-gray-800 rounded-full shadow-lg border border-blue-200 dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all select-none overflow-hidden"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span
                  className={`absolute top-0 left-0 w-1/2 h-full rounded-full shadow-xl transition-transform duration-300 ease-in-out z-0
                    ${mode === 'selling' ? 'translate-x-full bg-blue-500/90' : 'translate-x-0 bg-green-400/90'}
                    ring-2 ring-blue-300/40 dark:ring-blue-900/40`}
                />
                <span className="flex w-full h-full z-10 relative font-semibold text-lg select-none">
                  <span className={`flex items-center justify-center w-1/2 h-full transition-colors duration-300 font-bold ${mode === 'sharing' ? 'text-white' : 'text-gray-500 dark:text-gray-400 font-medium'}`}>Sharing</span>
                  <span className={`flex items-center justify-center w-1/2 h-full transition-colors duration-300 font-bold ${mode === 'selling' ? 'text-white' : 'text-gray-500 dark:text-gray-400 font-medium'}`}>Selling</span>
                </span>
              </button>
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-72 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition"
            />
            <button
              onClick={() => mode === 'sharing' ? setUploadSharingOpen(true) : setUploadSellingOpen(true)}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition-all"
            >
              Upload {mode === 'sharing' ? 'Sharing' : 'Selling'} Note
            </button>
          </div>
        </div>

        {loading ? (
          <Loader text="Loading notes..." />
        ) : notes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <span className="text-6xl mb-4">📄</span>
            <p className="text-gray-400 text-lg font-medium">No {mode} notes found. Start by uploading your first note!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map(note => (
              <NoteCard key={note._id} note={note} onClick={() => setSelected(note)} user={user} />
            ))}
          </div>
        )}

        <NoteModal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          note={selected}
          onPurchase={handlePurchase}
          user={user}
          onDelete={async (id) => {
            try {
              await api.delete(`/api/notes/${id}`);
              showSuccess('Note deleted');
              setSelected(null);
              fetchNotes(debouncedSearch);
            } catch (err) {
              showError(getErrorMessage(err) || 'Delete failed');
            }
          }}
        />

        <UploadSharingModal
          isOpen={uploadSharingOpen}
          onClose={() => setUploadSharingOpen(false)}
          fetchNotes={() => fetchNotes(debouncedSearch)}
          mode={mode}
        />
        <UploadSellingModal
          isOpen={uploadSellingOpen}
          onClose={() => setUploadSellingOpen(false)}
          fetchNotes={() => fetchNotes(debouncedSearch)}
          mode={mode}
        />
      </ErrorBoundary>
    </Layout>
  );
}
