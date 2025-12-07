import React from 'react';

interface DashboardFilterPanelProps {
  asOfDate: string;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRefresh: () => void;
  onApplyFilters: () => void;
  hasConnections: boolean;
}

const DashboardFilterPanel: React.FC<DashboardFilterPanelProps> = ({
  asOfDate,
  onDateChange,
  onRefresh,
  onApplyFilters,
  hasConnections,
}) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <h1 className="text-text-primary-light dark:text-text-primary-dark text-base font-medium leading-normal">Filters</h1>
      <label className="flex flex-col w-full">
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium pb-1.5">As of Date</p>
        <div className="flex w-full flex-1 items-stretch rounded-lg">
          <input
            type="date"
            value={asOfDate}
            onChange={onDateChange}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light dark:text-text-primary-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-input-border-light dark:border-input-border-dark bg-input-bg-light dark:bg-input-bg-dark focus:border-primary h-10 placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark p-2 text-sm font-normal leading-normal"
          />
        </div>
      </label>
      <button
        onClick={onApplyFilters}
        disabled={!hasConnections}
        className="w-full flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
        <span className="truncate">Apply Filters</span>
      </button>
      <button
        onClick={onRefresh}
        disabled={!hasConnections}
        className="w-full flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-search-bg-light dark:bg-search-bg-dark text-text-primary-light dark:text-text-primary-dark text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed">
        <span className="truncate">Refresh Data</span>
      </button>
    </div>
  );
};

export default DashboardFilterPanel;

