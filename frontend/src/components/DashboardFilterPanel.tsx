import React, { useState } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Import the default styles

interface DashboardFilterPanelProps {
  onFilterChange: (asOfDate: Date | undefined) => void;
  currentAsOfDate: Date | undefined;
}

const DashboardFilterPanel: React.FC<DashboardFilterPanelProps> = ({ onFilterChange, currentAsOfDate }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(currentAsOfDate);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    onFilterChange(date);
    setIsDatePickerOpen(false);
  };

  return (
    <div className="w-full lg:w-1/4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filters</h3>
      
      <div className="mb-4">
        <label htmlFor="asOfDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          As of Date
        </label>
        <div className="mt-1 relative">
          <input
            type="text"
            id="asOfDate"
            readOnly
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
            value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            placeholder="Select date"
          />
          {isDatePickerOpen && (
            <div className="absolute z-10 bg-white dark:bg-gray-700 rounded-lg shadow-lg mt-2">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                // Tailwind classes for react-day-picker, to match the UI. These are example classes.
                classNames={{
                  caption_label: 'text-gray-900 dark:text-white',
                  nav_button: 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600',
                  day: 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600',
                  day_selected: 'bg-primary text-white hover:bg-primary-dark',
                  day_today: 'text-primary'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Placeholder for future institution checkboxes (post-MVP) */}
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Institution filter (post-MVP)</p>
      </div>
    </div>
  );
};

export default React.memo(DashboardFilterPanel);