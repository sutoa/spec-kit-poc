import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import DashboardFilterPanel from '../components/DashboardFilterPanel';
import StatCard from '../components/StatCard';
import ReportTable from '../components/ReportTable';
import SkeletonLoader from '../components/SkeletonLoader'; // Assuming this component exists
import { DashboardResponse } from '../types/dashboard';
import { getDashboardData } from '../services/api'; // Assuming this function exists

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [asOfDate, setAsOfDate] = useState<Date | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const formattedDate = asOfDate ? asOfDate.toISOString().split('T')[0] : undefined;
      const data = await getDashboardData(formattedDate);
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      setDashboardData(null); // Clear data on error
    } finally {
      setLoading(false);
    }
  }, [asOfDate]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleDateChange = (date: Date | undefined) => {
    setAsOfDate(date);
  };

  const totalInstitutions = dashboardData?.institutions.length || 0;
  const grandTotal = dashboardData?.grand_total || 0;

  const showEmptyState = !loading && (!dashboardData || totalInstitutions === 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        title="Consolidated Account Report"
        showRefreshButton={true}
        onRefreshClick={loadDashboardData}
        disableRefresh={loading || totalInstitutions === 0}
      />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
        <div className="container mx-auto px-6 py-8">
          <div className="lg:flex gap-6">
            <DashboardFilterPanel onFilterChange={handleDateChange} currentAsOfDate={asOfDate} />

            <div className="flex-1 mt-6 lg:mt-0">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Error:</strong>
                  <span className="block sm:inline"> {error}</span>
                </div>
              )}

              {showEmptyState ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 text-center text-gray-500 dark:text-gray-400">
                  <p className="text-xl font-semibold mb-2">No Connected Institutions</p>
                  <p>Please go to the Connections page to add your financial institutions.</p>
                  {/* Potentially add a link/button to Connections page */}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {loading ? (
                      <>
                        <SkeletonLoader className="h-32" />
                        <SkeletonLoader className="h-32" />
                      </>
                    ) : (
                      <>
                        <StatCard title="Grand Total" value={`$${grandTotal.toFixed(2)}`} description="Total across all connected accounts" />
                        <StatCard title="Total Institutions" value={totalInstitutions} description="Number of connected financial institutions" />
                      </>
                    )}
                  </div>

                  {loading ? (
                    <SkeletonLoader className="h-96" />
                  ) : (
                    <ReportTable institutions={dashboardData?.institutions || []} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;