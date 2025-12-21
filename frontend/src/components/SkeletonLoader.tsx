import React from 'react';
import './SkeletonLoader.css'; // Import the CSS for animations

interface SkeletonLoaderProps {
  className?: string; // Optional CSS classes for size and shape
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className }) => {
  return (
    <div className={`skeleton-loader bg-gray-200 dark:bg-gray-700 rounded-md ${className}`}>
      {/* Content for the skeleton loader can be more complex if needed */}
    </div>
  );
};

export default SkeletonLoader;