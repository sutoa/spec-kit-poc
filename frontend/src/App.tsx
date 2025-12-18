import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ConnectionsPage from './pages/ConnectionsPage';
import { NotificationProvider } from './context/NotificationContext';
import SideNav from './components/SideNav';
import Header from './components/Header';

const App = () => {
  return (
    <NotificationProvider>
      <div className="flex h-screen bg-background-light dark:bg-background-dark font-display">
        <SideNav />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/connections" element={<ConnectionsPage />} />
              <Route path="/*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default App;