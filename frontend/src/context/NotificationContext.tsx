import React, { createContext, useContext, useState, ReactNode } from 'react';
import Notification from '../components/Notification';

type NotificationStatus = 'success' | 'error' | 'info';

interface NotificationState {
  message: string;
  status: NotificationStatus;
}

interface NotificationContextType {
  showNotification: (message: string, status: NotificationStatus) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = (message: string, status: NotificationStatus) => {
    setNotification({ message, status });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Notification
          message={notification.message}
          status={notification.status}
          onClose={() => setNotification(null)}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};