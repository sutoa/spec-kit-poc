import React, { useState } from 'react';

interface DashboardFilterPanelProps {
  onDateChange: (date: string) => void;
  onRefresh: () => void;
}

const DashboardFilterPanel: React.FC<DashboardFilterPanelProps> = ({ onDateChange, onRefresh }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    onDateChange(event.target.value);
  };

  return (
    <div className="p-4 border-r w-64">
      <h2 className="text-lg font-bold mb-4">Filters</h2>
      <div className="mb-4">
        <label htmlFor="asOfDate" className="block text-sm font-medium text-gray-700">As of Date</label>
        <input
          type="date"
          id="asOfDate"
          name="asOfDate"
          value={selectedDate}
          onChange={handleDateInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <button
        onClick={onRefresh}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Refresh Data
      </button>
      {/* Searchable list of institutions will go here later */}
    </div>
  );
};

export default DashboardFilterPanel;