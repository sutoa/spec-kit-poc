import React from 'react';
import { Link } from 'react-router-dom';

const SideNav: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">Account Viewer</div>
      <nav className="flex-grow">
        <Link to="/dashboard" className="block p-4 hover:bg-gray-700">Dashboard</Link>
        <Link to="/connections" className="block p-4 hover:bg-gray-700">Connections</Link>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Link to="/settings" className="block p-4 hover:bg-gray-700">Settings</Link>
        <Link to="/logout" className="block p-4 hover:bg-gray-700">Logout</Link>
      </div>
    </div>
  );
};

export default SideNav;