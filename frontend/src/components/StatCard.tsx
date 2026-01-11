// frontend/src/components/StatCard.tsx

import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 xl:p-8">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900 dark:text-white">
            {value}
          </span>
          <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
            {title}
          </h3>
        </div>
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
  );
};

export default StatCard;