import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../services/api';
import { DashboardFilterPanel } from '../components/DashboardFilterPanel';
import { ReportTable } from '../components/ReportTable';
import { StatCard } from '../components/StatCard';
import { useNotification } from '../context/NotificationContext'; // Import useNotification

interface Account {
  masked_account_number: string;
  balance: number;
  currency: string;
  as_of_date: string; // Assuming ISO date string
}

interface Institution {
  name: string;
  accounts: Account[];
  sub_total: number;
}

interface DashboardData {
  institutions: Institution[];
  grand_total: number;
}

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification(); // Use the notification hook

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await dashboardApi.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      showNotification('Failed to fetch dashboard data.', 'error'); // Use notification
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [showNotification]); // Add showNotification to dependency array

  const hasConnections = dashboardData && dashboardData.institutions.length > 0;

  const handleRefreshData = () => {
    fetchDashboardData(); // Re-fetch data on refresh
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRefreshData}
          disabled={!hasConnections || loading} // Disable if no connections or loading
        >
          Refresh Data
        </button>
      </div>
      
      {loading && <p>Loading dashboard data...</p>}
      {/* Removed local error display, global notification handles it */}

      {!loading && !hasConnections && ( // Removed !error check
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <p className="text-xl font-medium mb-2">No Data to Display</p>
          <p className="text-md">Connect your financial institutions to see your consolidated dashboard.</p>
          {/* Optionally, add a button to navigate to connections page */}
        </div>
      )}

      {!loading && hasConnections && dashboardData && ( // Removed !error check
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* First Column: Filters */}
          <div className="md:col-span-1">
            <DashboardFilterPanel />
          </div>

          {/* Second Column: Report */}
          <div className="md:col-span-2">
            <ReportTable institutions={dashboardData.institutions} />
          </div>

          {/* Third Column: Stats */}
          <div className="md:col-span-1 flex flex-col space-y-6">
            <StatCard title="Grand Total" value={`$${dashboardData.grand_total.toFixed(2)}`} />
            <StatCard title="Total Institutions" value={dashboardData.institutions.length.toString()} />
            {/* Other stat cards can go here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;