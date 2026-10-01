import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'navy' | 'amber' | 'emerald' | 'rose' | 'outline' | 'slate' | 'brand';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-bold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
  };

  const variants = {
    blue: 'bg-blue-50 text-blue-700 border border-blue-200',
    brand: 'bg-blue-50 text-blue-700 border border-blue-200',
    navy: 'bg-navy-900 text-white border border-navy-950',
    slate: 'bg-paper text-ink-2 border border-line',
    amber: 'bg-[#fff1cc] text-[#9a5f00] border border-[#ffc93c]/50',
    emerald: 'bg-[#dcf5ea] text-[#0f5e41] border border-[#2fbf8f]/40',
    rose: 'bg-danger/10 text-danger border border-danger/20',
    outline: 'bg-white text-ink-2 border border-line',
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
