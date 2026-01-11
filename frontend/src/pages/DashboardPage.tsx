// frontend/src/pages/DashboardPage.tsx

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

import StatCard from '../components/StatCard';

import ReportTable from '../components/ReportTable';

import DashboardFilterPanel from '../components/DashboardFilterPanel';

// import SkeletonLoader from '../components/SkeletonLoader'; // T020



const DashboardPage: React.FC = () => {

  const [report, setReport] = useState<DashboardReport | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  const [asOfDate, setAsOfDate] = useState<string | undefined>(undefined); // For filter

  const [selectedFilterDate, setSelectedFilterDate] = useState<Date | undefined>(undefined);



  useEffect(() => {

    fetchDashboardReport();

  }, [asOfDate]);



  const fetchDashboardReport = async () => {

    setLoading(true);

    setError(null);

    try {

      const data = await getDashboardData(asOfDate);

      setReport(data);

    } catch (err) {

      console.error("Failed to fetch dashboard report:", err);

      setError("Failed to load dashboard data. Please try again later.");

    } finally {

      setLoading(false);

    }

  };



  if (loading) {

    // return <SkeletonLoader />; // T020

    return (

      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">

        Loading Dashboard...

      </div>

    );

  }



  if (error) {

    return (

      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">

        Error: {error}

      </div>

    );

  }



  if (!report || report.institution_groups.length === 0) {

    return (

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">

        <h2 className="text-xl font-semibold mb-4">No Institutions Connected</h2>

        <p className="text-gray-400 text-center">

          It looks like you haven't connected any financial institutions yet.

          Go to the <span className="font-bold text-blue-400">Connections</span> page to get started!

        </p>

      </div>

    );

  }



  return (

    <div className="flex-1 flex flex-col lg:flex-row bg-background-light dark:bg-background-dark">

      {/* Filters Panel */}

      <aside className="w-full lg:w-80 flex-shrink-0 bg-panel-light dark:bg-panel-dark border-r border-border-light dark:border-border-dark flex flex-col p-6">

        <h1 className="text-text-primary-light dark:text-text-primary-dark text-base font-medium leading-normal">Filters</h1>

        <DashboardFilterPanel

          onFilterChange={setSelectedFilterDate}

          currentAsOfDate={selectedFilterDate}

        />

        {/* Placeholder for institution checkboxes - will integrate later */}

        <button

          onClick={() => setAsOfDate(selectedFilterDate ? format(selectedFilterDate, 'yyyy-MM-dd') : undefined)}

          className="w-full flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] mt-auto"

        >

          <span className="truncate">Apply Filters</span>

        </button>

      </aside>



      {/* Report Section */}

      <section className="flex-1 bg-background-light dark:bg-background-dark p-8 overflow-y-auto">

        <div className="max-w-4xl mx-auto flex flex-col gap-6">

          {/* Stat Cards */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <StatCard title="Grand Total" value={`${report.grand_total.toFixed(2)}`} />

            <StatCard title="Total Institutions" value={String(report.institution_groups.length)} />

          </div>



          {/* Report Table */}

          <ReportTable institutions={report.institution_groups} />

        </div>

      </section>

    </div>

  );

};



export default DashboardPage;