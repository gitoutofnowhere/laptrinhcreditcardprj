import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { CardyMascot } from '../brand/Mascot';

export interface ErrorNoticeProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorNotice: React.FC<ErrorNoticeProps> = ({
  title = 'Ối, chưa tải được.',
  message = 'Kiểm tra kết nối rồi thử lại nhé.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`rounded-3xl border border-line bg-white p-6 text-navy-900 shadow-card ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        <div className="shrink-0 -mt-2">
          <CardyMascot pose="oops" size={80} />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold text-navy-900">{title}</h4>
          <p className="text-xs text-ink-2 mt-1 leading-relaxed">{message}</p>
          {onRetry && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Thử lại
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
