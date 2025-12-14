import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ConnectionsPage from './pages/ConnectionsPage';
import { NotificationProvider, useNotification } from './context/NotificationContext';

const AppContent = () => {
  const { showNotification } = useNotification();

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <Layout title="Consolidated Account Report">
            <DashboardPage />
          </Layout>
        }
      />
      <Route
        path="/connections"
        element={
          <Layout title="Manage Financial Institutions">
            <ConnectionsPage />
          </Layout>
        }
      />
      {/* Redirect any other unmatched paths to dashboard */}
      <Route path="/*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
  );
};

export default App;