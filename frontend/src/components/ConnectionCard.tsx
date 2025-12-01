import React, { useState } from 'react';

interface Connection {
  id: number;
  institution_name: string;
  status: 'active' | 'inactive' | 'error';
}

interface ConnectionCardProps {
  connection: Connection;
  onConnectClick: () => void; // Add onConnectClick prop
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection, onConnectClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const statusColorClass = {
    active: 'bg-green-500',
    inactive: 'bg-gray-500',
    error: 'bg-red-500',
  }[connection.status];

  const handleConnectClick = () => {
    onConnectClick(); // Call the prop function
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between relative">
      <div className="flex items-center">
        <span className={`w-3 h-3 rounded-full ${statusColorClass} mr-3`}></span>
        <h3 className="text-lg font-semibold">{connection.institution_name}</h3>
      </div>
      <div className="relative">
        <button
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            {connection.status !== 'active' && (
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleConnectClick}
              >
                Connect
              </button>
            )}
            {/* Other menu items can go here */}
          </div>
        )}
      </div>
    </div>
  );
};