import React, { useEffect, useState } from 'react';
import { getDashboardData } from '../services/api';
import ReportTable from '../components/ReportTable';
import StatCard from '../components/StatCard';
import DashboardFilterPanel from '../components/DashboardFilterPanel';

interface Account {
  masked_account_number: string;
  balance: number;
  as_of_date: string; // YYYY-MM-DD
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

  const fetchDashboard = async (date?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardData(date);
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch dashboard data");
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

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!dashboardData) return <div>No dashboard data available.</div>;

  return (
    <div className="flex">
      <DashboardFilterPanel onDateChange={handleDateChange} onRefresh={handleRefresh} />
      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Consolidated Account Report</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard title="Grand Total" value={`$${dashboardData.grand_total.toFixed(2)}`} />
          <StatCard title="Total Institutions" value={dashboardData.institutions.length} />
        </div>
        <ReportTable institutions={dashboardData.institutions} grandTotal={dashboardData.grand_total} />
      </div>
    </div>
  );
};

export default DashboardPage;