import React from 'react';
import { toast } from 'react-toastify';

// Simple wrapper so we can change styles globally in one place
export const showSuccess = (message) => {
  toast.success(message, { theme: 'colored' });
};

export const showError = (message) => {
  toast.error(message, { theme: 'colored' });
};

export const showInfo = (message) => {
  toast.info(message, { theme: 'colored' });
};
