import React, { useEffect, useState } from 'react';
import { connectionsApi } from '../services/api';
import { ConnectionCard } from '../components/ConnectionCard';
import { useNotification } from '../context/NotificationContext'; // Import useNotification

interface Connection {
  id: number;
  institution_name: string;
  status: 'active' | 'inactive' | 'error';
}

const ConnectionsPage: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification(); // Use the notification hook

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const data = await connectionsApi.getConnections();
        setConnections(data);
      } catch (err) {
        showNotification('Failed to fetch connections.', 'error'); // Use notification
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, [showNotification]); // Add showNotification to dependency array

  const handleConnectInitiation = async () => {
    try {
      const response = await connectionsApi.initiateConnection();
      if (response.redirect_uri) {
        window.location.href = response.redirect_uri;
      } else {
        showNotification("Failed to get redirect URI from SnapTrade.", 'error'); // Use notification
      }
    } catch (err) {
      showNotification("Failed to initiate connection with SnapTrade.", 'error'); // Use notification
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Connections</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleConnectInitiation}
        >
          Add New Connection
        </button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search connections..."
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && <p>Loading connections...</p>}
      {/* Removed local error display, global notification handles it */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((conn) => (
          <ConnectionCard key={conn.id} connection={conn} onConnectClick={handleConnectInitiation} />
        ))}
        {!loading && connections.length === 0 && ( // Removed !error check
          <p>No connections found. Click "Add New Connection" to get started.</p>
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;