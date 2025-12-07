import React, { useCallback, useEffect, useState } from 'react';
import { SnapTradeConnect } from 'snaptrade-react';
import { connectionsApi } from '../services/api';
import ConnectionCard from '../components/ConnectionCard';
import { useNotification } from '../context/NotificationContext';

interface Connection {
  id: number;
  institution_name: string;
  status: string;
}

const ConnectionsPage = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectionData, setConnectionData] = useState<{ loginUrl: string; state: string } | null>(null);
  const { showNotification } = useNotification();

  const fetchConnections = useCallback(async () => {
    try {
      const data = await connectionsApi.getConnections();
      setConnections(data);
    } catch (error) {
      // The error is already handled by the api interceptor
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const handleAddConnection = async () => {
    try {
      const data = await connectionsApi.initiateConnection();
      if (data.redirect_uri && data.state) {
        setConnectionData({ loginUrl: data.redirect_uri, state: data.state });
      }
    } catch (error) {
      // The error is already handled by the api interceptor
    }
  };

  const handleSuccess = useCallback(
    async (authorizationId: string) => {
      if (connectionData?.state) {
        try {
          await connectionsApi.handleConnectionCallback(authorizationId, connectionData.state);
          setConnectionData(null); // Close the modal
          showNotification('Connection successful!', 'success');
          fetchConnections(); // Refresh the connections list
        } catch (error) {
          // The error is already handled by the api interceptor
        }
      } else {
        showNotification('Invalid state. Could not complete connection.', 'error');
      }
    },
    [connectionData, fetchConnections, showNotification]
  );

  const handleEvent = (event: any) => {
    console.log('SnapTrade Event:', event);
  };

  const handleExit = () => {
    console.log('SnapTrade exited');
    setConnectionData(null); // Close the modal
  };

  if (connectionData) {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-3/4">
          <SnapTradeConnect
            loginUrl={connectionData.loginUrl}
            onSuccess={handleSuccess}
            onEvent={handleEvent}
            onExit={handleExit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Connections</h1>
        <button
          onClick={handleAddConnection}
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Add Connection
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((connection) => (
          <ConnectionCard key={connection.id} connection={connection} />
        ))}
      </div>
      {connections.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No connections yet.</p>
          <p>Click "Add Connection" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage;

