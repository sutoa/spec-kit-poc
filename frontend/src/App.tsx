import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react'; // Import useEffect
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ConnectionsPage from './pages/ConnectionsPage';
import './App.css';
import { useNotification } from './context/NotificationContext'; // Import useNotification
import { setupInterceptors } from './services/api'; // Import setupInterceptors

function App() {
  const { showNotification } = useNotification(); // Use the notification hook

  useEffect(() => {
    setupInterceptors(showNotification); // Setup interceptors with the notification function
  }, [showNotification]); // Dependency array includes showNotification

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          {/* Add other routes here */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
