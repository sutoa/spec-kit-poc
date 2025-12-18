import React, { useEffect, useState } from 'react';
import { getDashboardData } from '../services/api';
import ReportTable from '../components/ReportTable';
import StatCard from '../components/StatCard';
import DashboardFilterPanel from '../components/DashboardFilterPanel';
import { useNotification } from '../context/NotificationContext';
import SkeletonLoader from '../components/SkeletonLoader';

interface Account {
  id: number;
  external_id: string;
  masked_account_number: string;
  balance: number;
  as_of_date: string;
  institution_id: number;
}

interface InstitutionData {
  id: number;
  external_id: string;
  name: string;
  status: string;
  accounts: Account[];
  sub_total: number;
}

interface DashboardData {
  grand_total: number;
  institutions: InstitutionData[];
}

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asOfDate, setAsOfDate] = useState<string | undefined>(undefined);
  const { showNotification } = useNotification();

  const fetchDashboard = async (date?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardData(date);
      setDashboardData(data);
      showNotification("Dashboard data refreshed successfully!", "success");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch dashboard data";
      setError(errorMessage);
      showNotification(errorMessage, "error");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(asOfDate);
  }, [asOfDate]);

  const handleDateChange = (date: string) => {
    setAsOfDate(date);
  };

  const handleRefresh = () => {
    fetchDashboard(asOfDate);
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error: {error}</div>;
  }
  
  if (!dashboardData || dashboardData.institutions.length === 0) {
    return (
      <div className="flex-1 p-8 bg-background-light dark:bg-background-dark text-center text-text-secondary-light dark:text-text-secondary-dark">
        <h1 className="text-2xl font-bold mb-4">Consolidated Account Report</h1>
        <p>No connected institutions found. Please connect an institution to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {dashboardData && (
        <aside className="w-80 flex-shrink-0 bg-panel-light dark:bg-panel-dark border-r border-border-light dark:border-border-dark flex flex-col p-6">
          <DashboardFilterPanel onDateChange={handleDateChange} onRefresh={handleRefresh} institutions={dashboardData.institutions.map(i => i.name)} />
        </aside>
      )}
      <section className="flex-1 bg-background-light dark:bg-background-dark p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title="Grand Total" value={`$${dashboardData.grand_total.toFixed(2)}`} />
            <StatCard title="Total Institutions" value={dashboardData.institutions.length} />
          </div>
          <ReportTable institutions={dashboardData.institutions} grandTotal={dashboardData.grand_total} />
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;