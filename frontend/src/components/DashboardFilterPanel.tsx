import React from 'react';

export const DashboardFilterPanel: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      <div className="mb-4">
        <label htmlFor="datePicker" className="block text-sm font-medium text-gray-700 mb-1">As of Date</label>
        <input
          type="date"
          id="datePicker"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="institutionSearch" className="block text-sm font-medium text-gray-700 mb-1">Institutions</label>
        <input
          type="text"
          id="institutionSearch"
          placeholder="Search institutions..."
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
        {/* Placeholder for institution checklist */}
        <div className="space-y-1">
          <label className="flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2 text-sm text-gray-700">All Institutions</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2 text-sm text-gray-700">Fidelity</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2 text-sm text-gray-700">Vanguard</span>
          </label>
        </div>
      </div>
    </div>
  );
};