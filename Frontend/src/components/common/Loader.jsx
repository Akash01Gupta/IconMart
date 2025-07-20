import React from 'react';

const Loader = ({ size = 16, color = 'blue-500' }) => {
  return (
    <div className="flex justify-center items-center py-10">
      <div
        className={`animate-spin rounded-full border-4 sm:border-8 border-t-transparent border-${color} h-${size} w-${size}`}
        role="status"
        aria-label="Loading..."
      ></div>
    </div>
  );
};

export default Loader;
