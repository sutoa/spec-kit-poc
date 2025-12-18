import * as React from 'react';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const getTitle = () => {
    if (location.pathname.includes('/connections')) {
      return 'Connection';
    }
    return 'Consolidated Account Report';
  };

  const renderButtons = () => {
    if (location.pathname.includes('/dashboard')) {
      return (
        <>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Export Report</span>
          </button>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-search-bg-light dark:bg-search-bg-dark text-text-primary-light dark:text-text-primary-dark text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Refresh Data</span>
          </button>
        </>
      );
    }
    return null;
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200/10 bg-background-light/80 px-8 backdrop-blur-sm dark:bg-background-dark/80">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{getTitle()}</h1>
      <div className="flex items-center gap-4">
        {renderButtons()}
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
          <span className="material-symbols-outlined text-xl">notifications</span>
        </button>
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
          <span className="material-symbols-outlined text-xl">help</span>
        </button>
        <div className="aspect-square size-10 rounded-full bg-cover bg-center bg-no-repeat" data-alt="User avatar image" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCdDfDWum4h4VQ_-Iq7pnnhIgODKjzchrgLKPokDc0bRqSH8ahnICKvQ53dvlxDGz20EejLiPPjpfuTU4ZBCsPUo-2KfZIpvTH_TI7Av05KYIWpvJbZWk-Wfc2wt7t8DFCG8i3pvKTY2VnbA7MJMywPeM8e0CJWhyqtysdwhuTCqlbu8AUuJqmfkLZxZ5aZ_GN9i38xKqw8dROlyB62LdwuPswB9akiMABYBNvOkvvQo4ebjBH5wowv7-siLUeoyJA2zFlBDEdhoNhJ")'}}></div>
      </div>
    </header>
  );
};

export default Header;