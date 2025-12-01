import React from 'react';
import { Link } from 'react-router-dom';

export const SideNav: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-semibold mb-6">Account Viewer</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <Link to="/dashboard" className="flex items-center p-2 rounded hover:bg-gray-700">
              <span className="mr-2">📊</span> Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/connections" className="flex items-center p-2 rounded hover:bg-gray-700">
              <span className="mr-2">🔌</span> Connections
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};