import React, { createContext, useContext, useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/notes');
      setNotes(res.data.notes || []);
    } catch {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/api/notes/${id}`);
      setNotes(prev => prev.filter(note => note._id !== id));
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  const purchaseNote = async (id) => {
    try {
      await api.post(`/api/notes/purchase/${id}`);
      toast.success('Note purchased successfully!');
    } catch {
      toast.error('Purchase failed');
    }
  };

  return (
    <NotesContext.Provider value={{ notes, loading, fetchNotes, deleteNote, purchaseNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
