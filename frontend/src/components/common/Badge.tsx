import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'slate' | 'brand' | 'amber' | 'emerald' | 'rose' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  };

  const variants = {
    slate: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    brand: 'bg-brand-50 text-brand-700 border border-brand-200/70',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    emerald: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    rose: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    outline: 'bg-white text-slate-600 border border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};
