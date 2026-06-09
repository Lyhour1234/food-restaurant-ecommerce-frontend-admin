import React from 'react';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`${sizes[size]} animate-spin rounded-full border-4 border-orange-200 border-t-orange-600`}></div>
      <p className="text-sm text-gray-500 font-khmer animate-pulse">កំពុងផ្ទុក...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;