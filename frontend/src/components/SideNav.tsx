import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SideNav: React.FC = () => {
  const location = useLocation();

  const getNavLinkClasses = (path: string) => {
    const baseClasses = "main-nav-item flex items-center gap-3 px-3 py-2 rounded-lg transition-colors";
    if (location.pathname === path) {
      return `${baseClasses} text-text-primary-light dark:text-text-primary-dark bg-primary/10`;
    }
    return `${baseClasses} text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5`;
  };

  return (
    <aside className="relative flex w-64 flex-col justify-between border-r border-slate-200/10 bg-white p-4 dark:bg-background-dark/50">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 p-2">
          <div className="text-primary">
            <svg className="size-6" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold tracking-[-0.015em] text-slate-800 dark:text-white">FinDash</h2>
        </div>
        <div className="flex flex-col gap-1">
          <Link to="/dashboard" className={getNavLinkClasses("/dashboard")}>
            <span className="material-symbols-outlined text-xl">dashboard</span>
            <p className="text-sm font-medium">Dashboard</p>
          </Link>
          <Link to="/connections" className={getNavLinkClasses("/connections")}>
            <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 1"}}>link</span>
            <p className="text-sm font-medium">Connections</p>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" href="#">
          <span className="material-symbols-outlined text-xl">settings</span>
          <p className="text-sm font-medium">Settings</p>
        </a>
        <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" href="#">
          <span className="material-symbols-outlined text-xl">logout</span>
          <p className="text-sm font-medium">Logout</p>
        </a>
      </div>
      <button className="absolute -right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:scale-110">
        <span className="material-symbols-outlined text-xl">chevron_left</span>
      </button>
    </aside>
  );
};

export default SideNav;