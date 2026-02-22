/**
 * Loading Spinner Component
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading...', fullHeight = false }) => {
  const containerClass = fullHeight
    ? 'flex items-center justify-center w-full h-full'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <div className="text-center">
        <Loader2 className="animate-spin text-blue-500 mx-auto mb-2" size={24} />
        <p className="text-sm text-zinc-400">{message}</p>
      </div>
    </div>
  );
};

/**
 * Skeleton Loader Component for content placeholders
 */
export const SkeletonLoader = ({ count = 3, height = 'h-12' }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${height} bg-zinc-800 rounded-lg animate-pulse`} />
      ))}
    </div>
  );
};

export default LoadingSpinner;
