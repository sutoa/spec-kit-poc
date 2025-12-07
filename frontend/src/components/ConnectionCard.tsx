import React from 'react';

interface Connection {
  id: number;
  institution_name: string;
  status: string;
}

interface ConnectionCardProps {
  connection: Connection;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection }) => {
  const statusClasses = {
    active: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    disconnected: 'bg-gray-100 text-gray-800',
  };

  const statusClass = statusClasses[connection.status] || statusClasses.disconnected;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{connection.institution_name}</h2>
        <div className="flex items-center">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusClass}`}>
            {connection.status}
          </span>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-2">
        <button className="text-sm text-gray-500 hover:text-gray-700">Refresh</button>
        <button className="text-sm text-red-500 hover:text-red-700">Delete</button>
      </div>
    </div>
  );
};

export default ConnectionCard;
