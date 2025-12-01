import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Dashboard</h1> {/* Placeholder, will be dynamic */}
      <div>
        {/* User profile or other header elements can go here */}
        <button className="p-2 rounded hover:bg-gray-200">Logout</button>
      </div>
    </header>
  );
};