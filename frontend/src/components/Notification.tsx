import React, { useEffect, useState } from 'react';

type NotificationStatus = 'success' | 'error' | 'info';

interface NotificationProps {
  message: string;
  status: NotificationStatus;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, status, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); // Wait for fade-out animation
  };

  const statusStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div
      className={`fixed bottom-5 right-5 p-4 rounded-lg text-white shadow-lg transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      } ${statusStyles[status]}`}
    >
      <span>{message}</span>
      <button onClick={handleClose} className="ml-4 font-bold">
        &times;
      </button>
    </div>
  );
};

export default React.memo(Notification);