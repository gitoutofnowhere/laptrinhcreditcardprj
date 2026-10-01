import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Đang tải dữ liệu...',
  size = 'md',
  fullHeight = false,
}) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-slate-500 py-8 ${
        fullHeight ? 'min-h-[300px]' : ''
      }`}
    >
      <Loader2 className={`${iconSizes[size]} animate-spin text-brand-600`} />
      {label && <p className="text-xs font-medium text-slate-500">{label}</p>}
    </div>
  );
};
