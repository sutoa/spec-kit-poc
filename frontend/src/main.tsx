import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { NotificationProvider } from './context/NotificationContext'; // Import NotificationProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NotificationProvider> {/* Wrap App with NotificationProvider */}
      <App />
    </NotificationProvider>
  </React.StrictMode>,
);
