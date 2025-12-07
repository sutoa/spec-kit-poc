import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
// import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import ConnectionsPage from './pages/ConnectionsPage';
import LoginPage from './pages/LoginPage';
// import { AuthProvider } from './context/AuthContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { setupInterceptors } from './services/api';

const AppContent = () => {
  const { showNotification } = useNotification();

  useEffect(() => {
    setupInterceptors(showNotification);
  }, [showNotification]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <Layout>
            <DashboardPage />
          </Layout>
        }
      />
      <Route
        path="/connections"
        element={
          <Layout>
            <ConnectionsPage />
          </Layout>
        }
      />
      {/* Redirect any other unmatched paths to dashboard */}
      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    // <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    // </AuthProvider>
  );
};

export default App;