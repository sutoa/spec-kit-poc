import React, { useEffect } from 'react';

interface NotificationProps {
  message: string | null;
  type: 'success' | 'error' | 'info' | null;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-close after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message || !type) {
    return null;
  }

  const baseClasses = 'fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white transition-opacity duration-300';
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold">X</button>
    </div>
  );
};
