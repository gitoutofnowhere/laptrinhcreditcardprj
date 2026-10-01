import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorNoticeProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorNotice: React.FC<ErrorNoticeProps> = ({
  title = 'Đã có lỗi xảy ra',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-rose-200/80 bg-rose-50/50 p-5 text-rose-900 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-rose-950">{title}</h4>
          <p className="text-xs text-rose-800/90 mt-1 leading-relaxed">{message}</p>
          {onRetry && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                className="bg-white border-rose-200 text-rose-800 hover:bg-rose-50"
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
