import React, { useState } from 'react';
import { getInstitutions } from '../services/api'; // Assuming a service to get institutions for the filter

interface DashboardFilterPanelProps {
  onDateChange: (date: string) => void;
  onRefresh: () => void;
}

const DashboardFilterPanel: React.FC<DashboardFilterPanelProps> = ({ onDateChange, onRefresh }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [allInstitutions, setAllInstitutions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([]);

  // Fetch all institutions for the filter panel (if not already provided by parent)
  React.useEffect(() => {
    const fetchAllInstitutions = async () => {
      try {
        const data = await getInstitutions();
        setAllInstitutions(data);
        // Initially select all institutions
        setSelectedInstitutions(data.map(inst => inst.id));
      } catch (error) {
        console.error("Error fetching all institutions for filter:", error);
      }
    };
    fetchAllInstitutions();
  }, []);

  const handleDateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    // onDateChange(event.target.value); // This will trigger fetch in DashboardPage
  };

  const handleApplyFilters = () => {
    onDateChange(selectedDate); // Apply date filter
    onRefresh(); // Refresh data based on filters
    // Logic for selectedInstitutions will be added later for post-MVP
  };

  const filteredInstitutions = allInstitutions.filter(inst =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-text-primary-light dark:text-text-primary-dark text-base font-medium leading-normal">Filters</h1>
      
      <label className="flex flex-col w-full">
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium pb-1.5">As of Date</p>
        <div className="flex w-full flex-1 items-stretch rounded-lg">
          <input
            type="date"
            id="asOfDate"
            name="asOfDate"
            value={selectedDate}
            onChange={handleDateInputChange}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light dark:text-text-primary-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-input-border-light dark:border-input-border-dark bg-input-bg-light dark:bg-input-bg-dark focus:border-primary h-10 placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark p-2 text-sm font-normal leading-normal rounded-r-none border-r-0"
          />
          <div className="text-text-secondary-light dark:text-text-secondary-dark flex border border-input-border-light dark:border-input-border-dark bg-input-bg-light dark:bg-input-bg-dark items-center justify-center pr-3 rounded-r-lg border-l-0">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
          </div>
        </div>
      </label>

      {/* Institutions filter - Post-MVP */}
      <div className="flex flex-col gap-2">
        <h2 className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium">Institutions</h2>
        <div className="w-full">
          <label className="flex flex-col min-w-40 h-10 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-text-secondary-light dark:text-text-secondary-dark flex border-none bg-search-bg-light dark:bg-search-bg-dark items-center justify-center pl-3 rounded-l-lg">
                <span className="material-symbols-outlined text-lg">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light dark:text-text-primary-dark focus:outline-0 focus:ring-0 border-none bg-search-bg-light dark:bg-search-bg-dark focus:border-none h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark px-3 rounded-l-none pl-2 text-sm font-normal leading-normal"
                placeholder="Find institution"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </label>
        </div>
        <div className="flex flex-col -mx-2 px-2 overflow-y-auto max-h-40" style={{'--checkbox-tick-svg': 'url(\'data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(255,255,255)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e\')' as any /* Type assertion */}}>
          {filteredInstitutions.map((inst: any) => (
            <label key={inst.id} className="flex gap-x-2.5 py-2.5 flex-row items-center cursor-pointer">
              <input
                checked={selectedInstitutions.includes(inst.id)}
                onChange={() => {
                  setSelectedInstitutions(prev => 
                    prev.includes(inst.id) ? prev.filter(id => id !== inst.id) : [...prev, inst.id]
                  );
                }}
                className="h-4 w-4 rounded border-input-border-light dark:border-input-border-dark border-2 bg-transparent text-primary checked:bg-primary checked:border-primary checked:bg-[image:--checkbox-tick-svg] focus:ring-2 focus:ring-offset-0 focus:ring-primary/50 focus:ring-offset-panel-light dark:focus:ring-offset-panel-dark focus:outline-none"
                type="checkbox"
              />
              <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-normal leading-normal">{inst.name}</p>
            </label>
          ))}
        </div>
      </div>


      <button
        onClick={handleApplyFilters}
        className="w-full flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] mt-auto"
      >
        <span className="truncate">Apply Filters</span>
      </button>
    </div>
  );
};

export default DashboardFilterPanel;