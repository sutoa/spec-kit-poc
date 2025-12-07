import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h4>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
};

export default StatCard;
