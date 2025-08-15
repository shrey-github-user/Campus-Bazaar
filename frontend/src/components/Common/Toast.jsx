
import React from 'react';
import { HiCheckCircle, HiExclamationCircle, HiXCircle, HiInformationCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';
export const showSuccess = (message) => {
  toast.success(message, { theme: 'colored' });
};

const icons = {
  success: <HiCheckCircle className="text-green-400 w-6 h-6" />,
  error: <HiXCircle className="text-red-400 w-6 h-6" />,
  warning: <HiExclamationCircle className="text-yellow-400 w-6 h-6" />,
  info: <HiInformationCircle className="text-blue-400 w-6 h-6" />,
};

const bgColors = {
  success: 'bg-green-50 border-green-400',
  error: 'bg-red-50 border-red-400',
  warning: 'bg-yellow-50 border-yellow-400',
  info: 'bg-blue-50 border-blue-400',
};

const Toast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl border shadow-2xl flex items-center gap-3 animate-fade-in ${bgColors[type] || bgColors.info}`}
      role="alert"
      aria-live="assertive"
    >
      {icons[type] || icons.info}
      <span className="font-medium text-gray-900">{message}</span>
      <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none text-2xl leading-none" aria-label="Close notification">&times;</button>
    </div>
  );
};

export default Toast;

export const showError = (message) => {
  toast.error(message, { theme: 'colored' });
};

export const showInfo = (message) => {
  toast.info(message, { theme: 'colored' });
};
