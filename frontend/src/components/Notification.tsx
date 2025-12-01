import React, { useState, useEffect } from 'react';

interface NotificationProps {
  message: string | null;
  type: 'success' | 'error' | 'info' | null;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 5000); // Notification disappears after 5 seconds
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, onClose]);

  if (!isVisible || !message) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type || 'info']; // Default to info if type is null

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${bgColor} z-50`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={() => { setIsVisible(false); onClose(); }} className="ml-4 text-white font-bold">
          &times;
        </button>
      </div>
    </div>
  );
};
