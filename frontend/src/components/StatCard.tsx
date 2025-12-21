import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 flex-1 min-w-[200px]">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</div>
      <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</div>
    </div>
  );
};

export default React.memo(StatCard);