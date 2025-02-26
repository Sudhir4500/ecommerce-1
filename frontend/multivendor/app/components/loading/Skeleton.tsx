// components/loading/SkeletonProductCard.tsx
import React from "react";

const SkeletonProductCard: React.FC = () => {
  return (
    <div className="border border-gray-300 rounded-xl p-4 animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-48 sm:h-64 bg-gray-200 rounded-lg"></div>

      {/* Text placeholders */}
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default SkeletonProductCard;