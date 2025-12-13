import React from 'react';
import { connectInstitution } from '../services/api';

interface ConnectionCardProps {
  institution: {
    id: string;
    name: string;
    status: string;
  };
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ institution }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await connectInstitution(institution.id);
      if (data.redirect_uri) {
        window.location.href = data.redirect_uri;
      }
    } catch (error: any) {
      setError(error);
      console.error('Error connecting to institution:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg">
      <h2 className="text-lg font-bold">{institution.name}</h2>
      <p>Status: {institution.status}</p>
      {institution.status !== 'connected' && (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Connecting...' : 'Connect'}
        </button>
      )}
      {error && <p className="text-red-500 mt-2">{error.message}</p>}
    </div>
  );
};

export default ConnectionCard;