import React from 'react';

export interface CardyLogoMarkProps {
  size?: number;
  mono?: string;
  className?: string;
}

export const CardyLogoMark: React.FC<CardyLogoMarkProps> = ({
  size = 40,
  mono,
  className = '',
}) => {
  const cardBack = mono ?? '#9eadfb';
  const cardFront = mono ?? '#4353e0';
  const sparkColor = mono ? '#ffffff' : '#ffffff';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-label="Cardy"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Back card */}
      <rect
        x="4"
        y="12"
        width="40"
        height="30"
        rx="7"
        transform="rotate(-14 24 27)"
        fill={cardBack}
        opacity={mono ? 0.45 : 1}
      />
      {/* Front card */}
      <rect
        x="16"
        y="20"
        width="42"
        height="32"
        rx="8"
        transform="rotate(-8 37 36)"
        fill={cardFront}
      />
      {/* Spark on card */}
      <path
        d="M40 27 C41 33 42 34 47.5 35 C42 36 41 37 40 43 C39 37 38 36 32.5 35 C38 34 39 33 40 27Z"
        fill={sparkColor}
        opacity={mono ? 0.9 : 1}
      />
      {/* Magnetic stripe / chip line */}
      <path
        d="M25 44 L31 43"
        stroke={mono ? '#ffffff' : '#ffffff'}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const CardySpark: React.FC<{ color?: string; size?: number; className?: string }> = ({
  color = '#4353e0',
  size = 18,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 1 C11 8 12 9 19 10 C12 11 11 12 10 19 C9 12 8 11 1 10 C8 9 9 8 10 1Z"
        fill={color}
      />
    </svg>
  );
};

export interface CardyLogoProps {
  size?: number;
  inverse?: boolean;
  tagline?: boolean;
  mono?: string;
  className?: string;
}

export const CardyLogo: React.FC<CardyLogoProps> = ({
  size = 36,
  inverse = false,
  tagline = false,
  mono,
  className = '',
}) => {
  const textColor = mono ?? (inverse ? '#ffffff' : '#1b2560');
  const sparkColor = mono ?? (inverse ? '#ffc93c' : '#4353e0');
  const subColor = inverse ? '#c6d1ff' : '#8189ad';

  return (
    <div className={`inline-flex items-center select-none ${className}`} style={{ gap: size * 0.28 }}>
      <CardyLogoMark size={size * 1.3} mono={mono ?? (inverse ? '#ffffff' : undefined)} />
      <div className="flex flex-col">
        <span
          className="inline-flex items-start font-display font-black tracking-[-0.03em] leading-none"
          style={{ fontSize: size, color: textColor }}
        >
          Cardy
          <span style={{ marginTop: -size * 0.12, marginLeft: size * 0.04 }}>
            <CardySpark color={sparkColor} size={size * 0.38} />
          </span>
        </span>
        {tagline && (
          <span
            className="font-semibold tracking-normal"
            style={{ fontSize: Math.max(10, size * 0.32), color: subColor, marginTop: size * 0.12 }}
          >
            Thanh toán card đi? Để Cardy!
          </span>
        )}
      </div>
    </div>
  );
};
