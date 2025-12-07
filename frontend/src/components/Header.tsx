import React from 'react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Consolidated Account Report';
      case '/connections':
        return 'Manage Connections';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-6 py-3 bg-panel-light dark:bg-panel-dark flex-shrink-0 h-16">
      <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-primary-light dark:text-text-primary-dark">{getTitle()}</h2>
      <div className="flex flex-1 justify-end gap-4 items-center">
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://i.pravatar.cc/40")'}}></div>
      </div>
    </header>
  );
};

export default Header;
