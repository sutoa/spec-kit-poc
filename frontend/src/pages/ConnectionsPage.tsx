import * as React from 'react';
import { useEffect, useState } from 'react';
import { getInstitutions, connectInstitution } from '../services/api';
import ConnectionCard from '../components/ConnectionCard';
import { Institution } from '../types/connection';

const ConnectionsPage: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInstitutions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getInstitutions();
        setInstitutions(data);
      } catch (err: any) {
        setError(err.message || "Error fetching institutions");
        console.error("Error fetching institutions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  const handleConnect = async (institutionId: number) => { // Changed type to number
    try {
      const data = await connectInstitution(institutionId);
      if (data.redirect_uri) {
        window.location.href = data.redirect_uri;
      }
    } catch (err: any) {
      setError(err.message || "Error connecting to institution");
      console.error('Error connecting to institution:', err);
    }
  };

  const filteredInstitutions = institutions.filter(inst =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">Manage Financial Institutions</p>
            <p className="text-base font-normal text-slate-500 dark:text-slate-400">Connect your accounts to consolidate all your financial data in one place.</p>
          </div>
          <button 
            onClick={() => handleConnect(1)} // Changed to pass a number
            className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary/90"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span className="truncate">Add New Connection</span>
          </button>
        </div>
        <div className="mb-6">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              className="block w-full rounded-lg border-slate-300 bg-white p-3 pl-12 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-primary"
              placeholder="Search for an institution..."
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {loading && <div>Loading connections...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 @lg:grid-cols-2 @4xl:grid-cols-3">
            {filteredInstitutions.map((inst) => (
              <ConnectionCard key={inst.id} institution={inst} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;