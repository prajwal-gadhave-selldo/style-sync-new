// components/LoadingFav.jsx
import React from "react";

const LoadingFav = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse border border-gray-100">
      {/* Header skeleton */}
      <div className="bg-gray-200 p-4">
        <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>
        <div className="absolute top-4 right-4 h-6 w-6 bg-gray-300 rounded-full"></div>
      </div>

      {/* Accuracy skeleton */}
      <div className="px-4 py-2 bg-gray-100">
        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto mt-2"></div>
      </div>

      {/* Items skeleton */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="h-36 bg-gray-200 rounded-lg"></div>
          <div className="h-36 bg-gray-200 rounded-lg"></div>
          <div className="h-36 bg-gray-200 rounded-lg"></div>
          <div className="h-36 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingFav;
