'use client';

import { TierLevel, TIER_CONFIGS } from '@/lib/types';

interface TierBadgeProps {
  level: TierLevel;
  size?: 'sm' | 'md' | 'lg';
}

export default function TierBadge({ level, size = 'md' }: TierBadgeProps) {
  const config = TIER_CONFIGS[level];

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const colorClasses = {
    gray: 'bg-gray-600 text-gray-200',
    blue: 'bg-blue-600 text-blue-100',
    purple: 'bg-purple-600 text-purple-100',
    red: 'bg-redpill-600 text-white redpill-glow',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full font-bold ${sizeClasses[size]} ${
        colorClasses[config.color as keyof typeof colorClasses]
      }`}
    >
      {level === 'god' && (
        <svg
          className="w-4 h-4 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {config.name}
    </div>
  );
}
