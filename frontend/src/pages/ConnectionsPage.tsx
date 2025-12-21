import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ConnectionCard from '../components/ConnectionCard';
import { getInstitutions } from '../services/api';
import { Institution } from '../types/connection';
import { useNotification } from '../context/NotificationContext';
import { SnapTradeError, SnapTradeSuccessData } from '../snaptrade-sdk';

const ConnectionsPage: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { showNotification } = useNotification();

  const loadInstitutions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getInstitutions();
      const sortedData = data.sort((a: Institution, b: Institution) => {
        if (a.status === 'connected' && b.status !== 'connected') return -1;
        if (a.status !== 'connected' && b.status === 'connected') return 1;
        return a.name.localeCompare(b.name);
      });
      setInstitutions(sortedData);
    } catch (error) {
      console.error('Failed to fetch institutions:', error);
      showNotification('Failed to load institutions. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadInstitutions();
  }, [loadInstitutions]);

  const handleSuccess = (data: SnapTradeSuccessData) => {
    showNotification(`Successfully connected institution with ID: ${data.connectionId}`, 'success');
    loadInstitutions();
  };

  const handleError = (error: SnapTradeError) => {
    showNotification(error.message, 'error');
  };

  const handleClose = () => {
    showNotification('Connection process cancelled.', 'info');
  };

  const filteredInstitutions = institutions.filter(inst =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        title="Manage Financial Institutions"
        showNotifications={true}
        showHelp={true}
      />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
        <div className="container mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Manage Financial Institutions</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Connect your bank, brokerage, and crypto accounts to get a consolidated view.
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <button
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow-md hover:bg-primary-dark transition-colors w-full sm:w-auto"
            >
              Add New Connection
            </button>

            <input
              type="text"
              placeholder="Search institutions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-48 animate-pulse"></div>
              ))}
            </div>
          ) : filteredInstitutions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 text-center text-gray-500 dark:text-gray-400">
              <p className="text-xl font-semibold mb-2">No institutions found.</p>
              <p>Try adjusting your search or add a new connection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstitutions.map((inst) => (
                <ConnectionCard
                  key={inst.id}
                  institution={inst}
                  onSuccess={handleSuccess}
                  onError={handleError}
                  onClose={handleClose}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConnectionsPage;

