import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import api from '../utils/api';
import { showError } from '../components/Common/Toast';
import Loader from '../components/Common/Loader';
import ErrorBoundary from '../components/Common/ErrorBoundary';
import NoteCard from '../components/Notes/NoteCard';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/user/me');
      setProfile(res.data.user);
    } catch {
      showError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <Layout>
      <ErrorBoundary>
        {loading ? (
          <Loader text="Loading profile..." />
        ) : !profile ? (
          <p className="text-gray-700 dark:text-gray-300">No profile data.</p>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
            </div>
            <h2 className="text-xl mb-3 text-gray-900 dark:text-white">Your Uploaded Notes</h2>
            {profile.notesUploaded?.length ? (
              <div className="grid gap-4 md:grid-cols-3">
                {profile.notesUploaded.map(note => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onClick={() => window.open(note.fileUrl, '_blank')}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No uploaded notes yet.</p>
            )}
          </>
        )}
      </ErrorBoundary>
    </Layout>
  );
}
