import React from 'react';

export type MascotPose =
  | 'hello'
  | 'search'
  | 'idea'
  | 'celebrate'
  | 'point'
  | 'love'
  | 'thumbs'
  | 'thinking'
  | 'secure'
  | 'saving'
  | 'sleep'
  | 'oops';

const COLOR_NAVY = '#23307e';
const COLOR_BLUE_LIGHT = '#6b7ff2';
const COLOR_BLUE_PRIMARY = '#4353e0';
const ORIGIN_LEFT = 'M56 96';
const ORIGIN_RIGHT = 'M144 92';

interface PoseConfig {
  tilt: number;
  eyes: 'open' | 'side' | 'wink' | 'happy' | 'closed';
  mouth: 'smile' | 'open' | 'o' | 'flat' | 'wobble';
  left: string;
  right: string;
  prop?: string;
  legs?: 'hop';
}

const POSES: Record<MascotPose, PoseConfig> = {
  hello: {
    tilt: -6,
    eyes: 'open',
    mouth: 'smile',
    left: `${ORIGIN_LEFT} C40 104 36 118 40 128`,
    right: `${ORIGIN_RIGHT} C160 84 166 66 162 52`,
  },
  search: {
    tilt: -8,
    eyes: 'wink',
    mouth: 'smile',
    left: `${ORIGIN_LEFT} C42 106 38 120 42 130`,
    right: `${ORIGIN_RIGHT} C156 100 164 108 168 112`,
    prop: 'glass',
  },
  idea: {
    tilt: 4,
    eyes: 'happy',
    mouth: 'open',
    left: `${ORIGIN_LEFT} C40 86 34 72 38 60`,
    right: `${ORIGIN_RIGHT} C160 84 166 70 164 58`,
    prop: 'bulb',
  },
  celebrate: {
    tilt: 0,
    eyes: 'happy',
    mouth: 'open',
    left: `${ORIGIN_LEFT} C40 80 34 60 30 46`,
    right: `${ORIGIN_RIGHT} C160 76 168 56 172 42`,
    legs: 'hop',
  },
  point: {
    tilt: -4,
    eyes: 'open',
    mouth: 'smile',
    left: `${ORIGIN_LEFT} C42 106 38 120 42 130`,
    right: `${ORIGIN_RIGHT} C162 92 176 88 186 84`,
  },
  love: {
    tilt: 6,
    eyes: 'happy',
    mouth: 'smile',
    left: `${ORIGIN_LEFT} C44 108 42 118 46 126`,
    right: `${ORIGIN_RIGHT} C156 104 160 112 160 118`,
    prop: 'heart',
  },
  thumbs: {
    tilt: -3,
    eyes: 'wink',
    mouth: 'open',
    left: `${ORIGIN_LEFT} C42 106 38 120 42 130`,
    right: `${ORIGIN_RIGHT} C160 96 168 88 170 76`,
    prop: 'thumb',
  },
  thinking: {
    tilt: 5,
    eyes: 'side',
    mouth: 'flat',
    left: `${ORIGIN_LEFT} C44 108 40 118 44 128`,
    right: `${ORIGIN_RIGHT} C150 112 128 120 118 114`,
    prop: 'dots',
  },
  secure: {
    tilt: 0,
    eyes: 'open',
    mouth: 'smile',
    left: `${ORIGIN_LEFT} C44 108 40 118 44 128`,
    right: `${ORIGIN_RIGHT} C152 106 150 116 146 120`,
    prop: 'shield',
  },
  saving: {
    tilt: -5,
    eyes: 'happy',
    mouth: 'smile',
    left: `${ORIGIN_LEFT} C40 92 38 78 42 70`,
    right: `${ORIGIN_RIGHT} C158 104 162 116 160 126`,
    prop: 'coin',
  },
  sleep: {
    tilt: 8,
    eyes: 'closed',
    mouth: 'o',
    left: `${ORIGIN_LEFT} C46 110 46 120 50 128`,
    right: `${ORIGIN_RIGHT} C154 108 154 118 150 126`,
    prop: 'zz',
  },
  oops: {
    tilt: -10,
    eyes: 'open',
    mouth: 'wobble',
    left: `${ORIGIN_LEFT} C40 86 40 74 50 68`,
    right: `${ORIGIN_RIGHT} C160 86 160 74 150 68`,
    prop: 'sweat',
  },
};

const MascotFace: React.FC<{ eyes: string; mouth: string }> = ({ eyes, mouth }) => {
  const renderEye = (cx: number, style: string, side: 'l' | 'r') => {
    if (style === 'open') {
      return (
        <g key={side}>
          <ellipse cx={cx} cy={84} rx={5} ry={6.5} fill={COLOR_NAVY} />
          <circle cx={cx + 1.6} cy={81.5} r={1.8} fill="#fff" />
        </g>
      );
    }
    if (style === 'side') {
      return (
        <g key={side}>
          <ellipse cx={cx} cy={84} rx={5} ry={6.5} fill={COLOR_NAVY} />
          <circle cx={cx + 2.6} cy={80.5} r={1.8} fill="#fff" />
        </g>
      );
    }
    if (style === 'wink' && side === 'r') {
      return (
        <path
          key={side}
          d={`M${cx - 6} 85 Q${cx} 79 ${cx + 6} 85`}
          stroke={COLOR_NAVY}
          strokeWidth={3.4}
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    if (style === 'wink') {
      return renderEye(cx, 'open', side);
    }
    if (style === 'happy') {
      return (
        <path
          key={side}
          d={`M${cx - 6} 86 Q${cx} 78 ${cx + 6} 86`}
          stroke={COLOR_NAVY}
          strokeWidth={3.4}
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    // closed
    return (
      <path
        key={side}
        d={`M${cx - 6} 84 Q${cx} 89 ${cx + 6} 84`}
        stroke={COLOR_NAVY}
        strokeWidth={3.4}
        fill="none"
        strokeLinecap="round"
      />
    );
  };

  return (
    <g>
      {renderEye(86, eyes, 'l')}
      {renderEye(114, eyes, 'r')}
      {/* Blush */}
      <ellipse cx={76} cy={97} rx={6} ry={3.6} fill="#ff9ec4" opacity={0.75} />
      <ellipse cx={124} cy={97} rx={6} ry={3.6} fill="#ff9ec4" opacity={0.75} />
      {/* Mouth */}
      {mouth === 'smile' && (
        <path
          d="M93 95 Q100 102 107 95"
          stroke={COLOR_NAVY}
          strokeWidth={3.2}
          fill="none"
          strokeLinecap="round"
        />
      )}
      {mouth === 'open' && (
        <path
          d="M92 94 Q100 94 108 94 Q107 106 100 106 Q93 106 92 94Z"
          fill={COLOR_NAVY}
        />
      )}
      {mouth === 'open' && (
        <path
          d="M95 102 Q100 99 105 102 Q103 105 100 105 Q97 105 95 102Z"
          fill="#ff7aa8"
        />
      )}
      {mouth === 'o' && (
        <ellipse cx={100} cy={99} rx={3.2} ry={3.8} fill={COLOR_NAVY} />
      )}
      {mouth === 'flat' && (
        <path d="M94 98 L106 97" stroke={COLOR_NAVY} strokeWidth={3.2} strokeLinecap="round" />
      )}
      {mouth === 'wobble' && (
        <path
          d="M92 99 Q96 95 100 99 Q104 103 108 99"
          stroke={COLOR_NAVY}
          strokeWidth={3.2}
          fill="none"
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

const MascotLimb: React.FC<{ d: string }> = ({ d }) => {
  const match = d.match(/(-?\d+\.?\d*) (-?\d+\.?\d*)$/);
  const [x, y] = match ? [+match[1], +match[2]] : [0, 0];
  return (
    <g>
      <path d={d} stroke={COLOR_NAVY} strokeWidth={9} fill="none" strokeLinecap="round" />
      <circle cx={x} cy={y} r={7.5} fill={COLOR_NAVY} />
    </g>
  );
};

const MascotProp: React.FC<{ kind?: string; right: string }> = ({ kind, right }) => {
  const match = right.match(/(-?\d+\.?\d*) (-?\d+\.?\d*)$/);
  const [rx, ry] = match ? [+match[1], +match[2]] : [0, 0];

  switch (kind) {
    case 'glass':
      return (
        <g>
          <path d={`M${rx} ${ry} L${rx + 6} ${ry - 8}`} stroke={COLOR_NAVY} strokeWidth={6} strokeLinecap="round" />
          <circle cx={rx + 16} cy={ry - 22} r={15} fill="#e2e8ff" fillOpacity={0.7} stroke={COLOR_BLUE_PRIMARY} strokeWidth={5} />
          <path d={`M${rx + 9} ${ry - 28} Q${rx + 12} ${ry - 32} ${rx + 17} ${ry - 32}`} stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>
      );
    case 'bulb':
      return (
        <g transform="translate(100 18)">
          <circle r={11} fill="#ffc93c" />
          <rect x={-5} y={9} width={10} height={7} rx={2} fill="#8189ad" />
          <path d="M-20 -6 L-26 -9 M20 -6 L26 -9 M0 -18 L0 -24" stroke="#ffc93c" strokeWidth={3} strokeLinecap="round" />
        </g>
      );
    case 'heart':
      return (
        <g>
          <rect x={rx - 12} y={ry - 30} width={26} height={34} rx={5} fill="#c6d1ff" stroke={COLOR_BLUE_PRIMARY} strokeWidth={3} />
          <path d={`M${rx + 24} ${ry - 38} c-4 -7 -14 -4 -11 4 c2 5 11 10 11 10 s9 -5 11 -10 c3 -8 -7 -11 -11 -4z`} fill="#ff9ec4" />
        </g>
      );
    case 'thumb':
      return <path d={`M${rx - 3} ${ry - 6} L${rx - 3} ${ry - 17}`} stroke={COLOR_NAVY} strokeWidth={7} strokeLinecap="round" />;
    case 'shield':
      return (
        <g transform={`translate(${rx - 4} ${ry - 4})`}>
          <path d="M0 -20 L18 -13 V2 C18 14 9 20 0 24 C-9 20 -18 14 -18 2 V-13Z" fill="#1fa774" stroke="#fff" strokeWidth={3} />
          <path d="M-7 1 L-2 6 L8 -5" stroke="#fff" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case 'coin':
      return (
        <g>
          <circle cx={42} cy={54} r={14} fill="#ffc93c" stroke="#e8a91a" strokeWidth={3} />
          <text x={42} y={59.5} textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight={900} fontSize={15} fill="#a06a00">
            ₫
          </text>
        </g>
      );
    case 'zz':
      return (
        <g fill={COLOR_BLUE_PRIMARY} fontFamily="Nunito, sans-serif" fontWeight={900}>
          <text x={150} y={42} fontSize={18}>z</text>
          <text x={164} y={28} fontSize={13} opacity={0.6}>z</text>
        </g>
      );
    case 'sweat':
      return <path d="M146 56 c4 6 6 9 6 12 a6 6 0 0 1 -12 0 c0 -3 2 -6 6 -12z" fill="#7cc4ff" />;
    case 'dots':
      return (
        <g fill="#9eadfb">
          <circle cx={150} cy={44} r={4} />
          <circle cx={164} cy={34} r={6} />
          <circle cx={180} cy={20} r={8.5} />
        </g>
      );
    default:
      return null;
  }
};

export interface CardyMascotProps {
  pose?: MascotPose;
  size?: number;
  className?: string;
}

export const CardyMascot: React.FC<CardyMascotProps> = ({
  pose = 'hello',
  size = 140,
  className = '',
}) => {
  const p = POSES[pose] || POSES.hello;
  const isHop = p.legs === 'hop';

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`select-none ${className}`}
      role="img"
      aria-label={`Cardy mascot — ${pose}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ground shadow */}
      <ellipse
        cx={100}
        cy={188}
        rx={isHop ? 30 : 40}
        ry={isHop ? 4 : 6}
        fill="#1b2560"
        opacity={isHop ? 0.07 : 0.12}
      />

      <g transform={isHop ? 'translate(0 -8)' : undefined}>
        {/* Legs */}
        <path
          d={isHop ? 'M86 126 C84 144 76 156 70 166' : 'M86 126 C86 146 82 160 80 174'}
          stroke={COLOR_NAVY}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={isHop ? 'M114 126 C116 144 124 156 130 166' : 'M114 126 C114 146 118 160 120 174'}
          stroke={COLOR_NAVY}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
        />
        {/* Shoes */}
        <ellipse cx={isHop ? 66 : 74} cy={isHop ? 170 : 178} rx={12} ry={7} fill={COLOR_NAVY} />
        <ellipse cx={isHop ? 134 : 126} cy={isHop ? 170 : 178} rx={12} ry={7} fill={COLOR_NAVY} />

        {/* Left Arm */}
        <MascotLimb d={p.left} />

        {/* Card Body */}
        <g transform={`rotate(${p.tilt} 100 86)`}>
          {/* 4px Navy Base Edge for tactile depth */}
          <rect x={48} y={42} width={104} height={86} rx={16} fill={COLOR_BLUE_PRIMARY} />
          {/* Main Card Body */}
          <rect x={48} y={38} width={104} height={86} rx={16} fill={COLOR_BLUE_LIGHT} />
          {/* Highlight stripe */}
          <rect x={54} y={42} width={92} height={10} rx={5} fill="#fff" opacity={0.16} />
          {/* Gold Chip */}
          <rect x={60} y={54} width={18} height={14} rx={3.5} fill="#ffd66b" />
          <path d="M60 61 H78 M69 54 V68" stroke="#e8a91a" strokeWidth={1.4} />
          {/* White Card Stripes */}
          <rect x={118} y={55} width={22} height={5} rx={2.5} fill="#fff" opacity={0.65} />
          <rect x={126} y={63} width={14} height={4} rx={2} fill="#fff" opacity={0.45} />

          {/* Face */}
          <MascotFace eyes={p.eyes} mouth={p.mouth} />
        </g>

        {/* Prop & Right Arm */}
        <MascotProp kind={p.prop} right={p.right} />
        <MascotLimb d={p.right} />
      </g>
    </svg>
  );
};
