import React, { useState, Fragment } from 'react';
import { Dialog, Transition, Switch } from '@headlessui/react';
import api from '../../utils/api';
import { showSuccess, showError } from '../Common/Toast';

export default function UploadModal({ isOpen, onClose, fetchNotes }) {
  const [form, setForm] = useState({ title: '', description: '', price: '' });
  const [isSelling, setIsSelling] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) return showError('Please select a file');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      if (isSelling) formData.append('price', form.price);
      formData.append('file', file);

      const endpoint = isSelling
        ? '/api/notes/upload-selling'
        : '/api/notes/upload-sharing';

      await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showSuccess('Note uploaded successfully!');
      fetchNotes();
      onClose();
      setForm({ title: '', description: '', price: '' });
      setFile(null);
      setIsSelling(false);
    } catch (err) {
      showError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        {/* Modal container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 translate-y-4 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-4 scale-95"
          >
            <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 animate-fadeIn">
              <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Upload Note
              </Dialog.Title>

              {/* Upload Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title"
                  className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                  required
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                  rows="3"
                  required
                />

                {/* Sell/Share Toggle */}
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={isSelling}
                    onChange={setIsSelling}
                    className={`${
                      isSelling ? 'bg-blue-600' : 'bg-gray-300'
                    } relative inline-flex h-6 w-12 items-center rounded-full transition-colors`}
                  >
                    <span
                      className={`${
                        isSelling ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <span className="text-sm text-gray-900 dark:text-gray-200">
                    {isSelling ? 'Selling' : 'Sharing'}
                  </span>
                </div>

                {isSelling && (
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Price (₹)"
                    type="number"
                    className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                    required
                  />
                )}

                <input
                  type="file"
                  accept=".pdf,.docx,.pptx"
                  onChange={e => setFile(e.target.files[0])}
                  className="w-full text-gray-900 dark:text-gray-200"
                  required
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:opacity-80 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
