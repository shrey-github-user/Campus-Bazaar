import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import { ChatProvider } from './context/ChatContext';

// Styles
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider>
    <AuthProvider>
      <NotesProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </NotesProvider>
    </AuthProvider>
  </ThemeProvider>
);
