import React from 'react';
import { Button } from './Button';
import { CardyMascot } from '../brand/Mascot';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'Chưa có card nào ở đây.',
  description = 'Thử đổi tiêu chí xem nhé.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl border border-line bg-white shadow-card ${className}`}
    >
      <div className="mb-4">
        {icon ? (
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
            {icon}
          </div>
        ) : (
          <CardyMascot pose="sleep" size={120} />
        )}
      </div>
      <h3 className="text-base font-bold text-navy-900 mb-1">{title}</h3>
      <p className="text-xs text-ink-2 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
