import React, { useEffect, useState } from 'react';
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

export default function Home() {
  // ...existing code from Dashboard.jsx...
}
