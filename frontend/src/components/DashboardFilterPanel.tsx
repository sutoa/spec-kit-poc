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
    <div className="flex flex-col gap-4">
      <label className="flex flex-col w-full">
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium pb-1.5">As of Date</p>
        <div className="flex w-full flex-1 items-stretch rounded-lg">
          <input
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light dark:text-text-primary-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-input-border-light dark:border-input-border-dark bg-input-bg-light dark:bg-input-bg-dark focus:border-primary h-10 placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark p-2 text-sm font-normal leading-normal rounded-r-none border-r-0"
            value={selectedDate ? format(selectedDate, 'MMM dd, yyyy') : ''}
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            readOnly
          />
          <div className="text-text-secondary-light dark:text-text-secondary-dark flex border border-input-border-light dark:border-input-border-dark bg-input-bg-light dark:bg-input-bg-dark items-center justify-center pr-3 rounded-r-lg border-l-0">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
          </div>
          {isDatePickerOpen && (
            <div className="absolute z-10 bg-panel-light dark:bg-panel-dark rounded-lg shadow-lg mt-12">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                classNames={{
                  caption_label: 'text-text-primary-light dark:text-text-primary-dark',
                  nav_button: 'text-text-primary-light dark:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5',
                  day: 'text-text-primary-light dark:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5',
                  day_selected: 'bg-primary text-white hover:bg-primary/90',
                  day_today: 'text-primary'
                }}
              />
            </div>
          )}
        </div>
      </label>

      {/* Placeholder for future institution checkboxes - based on code.html structure */}
      <div className="flex flex-col gap-2">
        <h2 className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium">Institutions</h2>
        <div className="w-full">
          <label className="flex flex-col min-w-40 h-10 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-text-secondary-light dark:text-text-secondary-dark flex border-none bg-search-bg-light dark:bg-search-bg-dark items-center justify-center pl-3 rounded-l-lg">
                <span className="material-symbols-outlined text-lg">search</span>
              </div>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light dark:text-text-primary-dark focus:outline-0 focus:ring-0 border-none bg-search-bg-light dark:bg-search-bg-dark focus:border-none h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark px-3 rounded-l-none pl-2 text-sm font-normal leading-normal" placeholder="Find institution" value=""/>
            </div>
          </label>
        </div>
                  <div className="flex flex-col -mx-2 px-2 overflow-y-auto" style={{ "--checkbox-tick-svg": "url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(255,255,255)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e')" }}>          <label className="flex gap-x-2.5 py-2.5 flex-row items-center cursor-pointer">
            <input checked={true} className="h-4 w-4 rounded border-input-border-light dark:border-input-border-dark border-2 bg-transparent text-primary checked:bg-primary checked:border-primary checked:bg-[image:--checkbox-tick-svg] focus:ring-2 focus:ring-offset-0 focus:ring-primary/50 focus:ring-offset-panel-light dark:focus:ring-offset-panel-dark focus:outline-none" type="checkbox"/>
            <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-normal leading-normal">Alpaca</p>
          </label>
          <label className="flex gap-x-2.5 py-2.5 flex-row items-center cursor-pointer">
            <input checked={true} className="h-4 w-4 rounded border-input-border-light dark:border-input-border-dark border-2 bg-transparent text-primary checked:bg-primary checked:border-primary checked:bg-[image:--checkbox-tick-svg] focus:ring-2 focus:ring-offset-0 focus:ring-primary/50 focus:ring-offset-panel-light dark:focus:ring-offset-panel-dark focus:outline-none" type="checkbox"/>
            <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-normal leading-normal">Vanguard</p>
          </label>
          <label className="flex gap-x-2.5 py-2.5 flex-row items-center cursor-pointer">
            <input checked={true} className="h-4 w-4 rounded border-input-border-light dark:border-input-border-dark border-2 bg-transparent text-primary checked:bg-primary checked:border-primary checked:bg-[image:--checkbox-tick-svg] focus:ring-2 focus:ring-offset-0 focus:ring-primary/50 focus:ring-offset-panel-light dark:focus:ring-offset-panel-dark focus:outline-none" type="checkbox"/>
            <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-normal leading-normal">TD Trade</p>
          </label>
          <label className="flex gap-x-2.5 py-2.5 flex-row items-center cursor-pointer">
            <input className="h-4 w-4 rounded border-input-border-light dark:border-input-border-dark border-2 bg-transparent text-primary checked:bg-primary checked:border-primary checked:bg-[image:--checkbox-tick-svg] focus:ring-2 focus:ring-offset-0 focus:ring-primary/50 focus:ring-offset-panel-light dark:focus:ring-offset-panel-dark focus:outline-none" type="checkbox"/>
            <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-normal leading-normal">Bank of America</p>
          </label>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DashboardFilterPanel);