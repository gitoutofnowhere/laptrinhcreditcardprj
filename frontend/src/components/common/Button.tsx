import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 select-none disabled:opacity-50 disabled:pointer-events-none disabled:active:translate-y-0 disabled:active:shadow-none';

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-6 py-3 gap-2.5 h-12',
  };

  const variants = {
    primary:
      'bg-blue-600 text-white shadow-[0_3px_0_#23307e] hover:bg-blue-500 active:translate-y-[2px] active:shadow-[0_1px_0_#23307e]',
    secondary:
      'bg-white text-navy-900 border border-line hover:border-blue-300 hover:bg-blue-50/50 shadow-sm active:translate-y-[1px]',
    outline:
      'border border-line bg-white/90 text-navy-900 hover:bg-white hover:border-blue-400 active:bg-blue-50/50 shadow-2xs',
    ghost:
      'text-ink-2 hover:text-navy-900 hover:bg-blue-50/80 active:bg-blue-100/60',
    danger:
      'bg-danger/10 text-danger border border-danger/25 hover:bg-danger/20 active:translate-y-[1px]',
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : icon}
      <span>{children}</span>
    </button>
  );
};
