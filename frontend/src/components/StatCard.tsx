import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  valueClassName?: string; // Optional class for value for different sizes
}

const StatCard: React.FC<StatCardProps> = ({ title, value, valueClassName = "text-3xl" }) => {
  return (
    <div className="bg-panel-light dark:bg-panel-dark p-6 rounded-xl border border-border-light dark:border-border-dark flex-1">
      <p className="text-base font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">{title}</p>
      <p className={`${valueClassName} font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight`}>{value}</p>
    </div>
  );
};

export default StatCard;