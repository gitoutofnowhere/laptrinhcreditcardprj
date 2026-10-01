import React from 'react';
import { CardyMascot } from '../brand/Mascot';

export interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Để Cardy xem card nào hợp…',
  size = 'md',
  fullHeight = false,
}) => {
  const mascotSizes = {
    sm: 64,
    md: 96,
    lg: 130,
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-8 select-none ${
        fullHeight ? 'min-h-[300px]' : ''
      }`}
    >
      <div className="animate-bounce" style={{ animationDuration: '2s' }}>
        <CardyMascot pose="search" size={mascotSizes[size]} />
      </div>
      {label && (
        <p className="text-xs font-bold text-ink-2 bg-white px-3.5 py-1.5 rounded-full border border-line shadow-2xs">
          {label}
        </p>
      )}
    </div>
  );
};
