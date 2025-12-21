import React from 'react';

interface HeaderProps {
  title: string; // The main title to display
  subtitle?: string; // Optional subtitle to display below the title
  showExport?: boolean;
  showRefreshButton?: boolean; // Controls visibility of the refresh button
  onRefreshClick?: () => void; // Callback for when refresh button is clicked
  disableRefresh?: boolean; // Disables the refresh button
  showNotifications?: boolean; // Controls visibility of the notifications icon
  showHelp?: boolean; // Controls visibility of the help icon
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, showExport, showRefreshButton, onRefreshClick, disableRefresh, showNotifications, showHelp }) => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-6 py-3 bg-panel-light dark:bg-panel-dark flex-shrink-0 h-16">
      <div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-primary-light dark:text-text-primary-dark">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{subtitle}</p>
        )}
      </div>
      <div className="flex flex-1 justify-end gap-4 items-center">
        {showNotifications && (
            <span className="material-symbols-outlined text-text-primary-light dark:text-text-primary-dark cursor-pointer text-2xl">notifications</span>
        )}
        {showHelp && (
            <span className="material-symbols-outlined text-text-primary-light dark:text-text-primary-dark cursor-pointer text-2xl">help</span>
        )}
        <div className="flex gap-2">
          {showExport && ( // Renamed from showExport to showExportButton
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Export Report</span>
            </button>
          )}
          {showRefreshButton && (
            <button
              onClick={onRefreshClick}
              disabled={disableRefresh}
              className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-search-bg-light dark:bg-search-bg-dark text-text-primary-light dark:text-text-primary-dark text-sm font-bold leading-normal tracking-[0.015em]
                ${disableRefresh ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <span className="truncate">Refresh Data</span>
            </button>
          )}
        </div>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          data-alt="User avatar image"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDMYwGHah-qvsDx9c2AhpUxDCo7K7AK4ThTzCzIW9mZbh6F1VdHPvhYBzHV4Xo1MQ2qv8GCFaHeRXEVoHs6IvQk5EAnCSLPd-TUtslMHGaW7Gjj8ErLf0rCqAoplvIU9nA324f6eC9EeHnD0SKJC0lLjuMl8qXHpjAU7QVTPoVgUiXE3kiy4eeHS0FmZVzhsF5K_cMo5RvxE_bf7D0fphopbYcGMEpo4Nsy0E9Lt-vRA__4JZyeHrdRD7X0jmyt_oltAwSUi7upXQH1")',
          }}
        ></div>
      </div>
    </header>
  );
};

export default React.memo(Header);
