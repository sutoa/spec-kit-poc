import React, { useCallback, useEffect, useState } from 'react';
import { dashboardApi, connectionsApi } from '../services/api';
import ReportTable from '../components/ReportTable';
import StatCard from '../components/StatCard';
import DashboardFilterPanel from '../components/DashboardFilterPanel';
import SkeletonLoader from '../components/SkeletonLoader';
import { useNotification } from '../context/NotificationContext';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [asOfDate, setAsOfDate] = useState<string>('');
  const { showNotification } = useNotification();

  const fetchDashboardData = useCallback(async (date?: string) => {
    setLoading(true);
    try {
      const data = await dashboardApi.getDashboardData(date);
      setDashboardData(data);
    } catch (error) {
      // Notification is handled by the interceptor
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchConnections = useCallback(async () => {
    try {
      const data = await connectionsApi.getConnections();
      setConnections(data);
    } catch (error) {
      // Notification is handled by the interceptor
    }
  }, []);

  useEffect(() => {
    fetchConnections();
    fetchDashboardData(asOfDate);
  }, [fetchConnections, fetchDashboardData, asOfDate]);

  const handleRefresh = () => {
    showNotification('Refreshing data...', 'info');
    fetchDashboardData(asOfDate);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAsOfDate(e.target.value);
  };
  
  const handleApplyFilters = () => {
      fetchDashboardData(asOfDate);
  }

  return (
    <div className="flex flex-1">
      <aside className="w-80 flex-shrink-0 bg-panel-light dark:bg-panel-dark border-r border-border-light dark:border-border-dark flex flex-col p-6">
        <DashboardFilterPanel
          asOfDate={asOfDate}
          onDateChange={handleDateChange}
          onRefresh={handleRefresh}
          onApplyFilters={handleApplyFilters}
          hasConnections={connections.length > 0}
        />
      </aside>
      <section className="flex-1 bg-background-light dark:bg-background-dark p-8 overflow-y-auto">
        {loading ? (
          <SkeletonLoader />
        ) : !dashboardData || dashboardData.institutions.length === 0 ? (
          <div className="text-center py-20 bg-panel-light dark:bg-panel-dark rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">No Data to Display</h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Please connect one or more financial institutions on the 'Connections' page.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <div className="bg-panel-light dark:bg-panel-dark p-6 rounded-xl border border-border-light dark:border-border-dark flex-1">
              <StatCard
                title="Grand Total (USD)"
                value={dashboardData.grand_total.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              />
            </div>
            <ReportTable institutions={dashboardData.institutions} />
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
