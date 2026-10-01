import React from 'react';
import { Wifi } from 'lucide-react';
import { getBankColor } from '../../utils/formatters';

interface CreditCardVisualProps {
  cardName: string;
  bankName?: string | null;
  bankId?: string | null;
  network?: string | null;
  cardTier?: string | null;
  annualFee?: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CreditCardVisual: React.FC<CreditCardVisualProps> = ({
  cardName,
  bankName,
  bankId,
  network,
  cardTier,
  size = 'md',
  className = '',
}) => {
  const { gradient, text } = getBankColor(bankId);

  const sizeClasses = {
    sm: 'w-56 h-36 p-3.5 text-xs rounded-xl shadow-sm',
    md: 'w-72 h-44 p-5 text-sm rounded-2xl shadow-md',
    lg: 'w-full max-w-sm h-52 p-6 text-sm rounded-2xl shadow-lg',
  };

  const networkStr = (network || 'VISA').toUpperCase();
  const tierStr = (cardTier || 'Classic').toUpperCase();

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} text-white select-none flex flex-col justify-between transition-all duration-300 border border-white/10 ${sizeClasses[size]} ${className}`}
    >
      {/* Background subtle watermark & geometric light */}
      <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/5 blur-xl pointer-events-none" />
      <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full bg-black/20 blur-xl pointer-events-none" />

      {/* Top Header: Bank Name & Contactless */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="font-extrabold tracking-wider text-xs uppercase opacity-95">
            {bankName || bankId || 'NGÂN HÀNG'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 opacity-70">
          <Wifi className="w-4 h-4 rotate-90" />
        </div>
      </div>

      {/* Center: EMV Chip & Tier */}
      <div className="flex items-center justify-between z-10 my-auto">
        <div className="flex items-center gap-3">
          {/* Metallic Chip */}
          <div className="w-9 h-7 rounded bg-gradient-to-tr from-amber-200 via-amber-100 to-amber-300 p-0.5 border border-amber-400/50 shadow-inner flex flex-col justify-around">
            <div className="w-full h-px bg-amber-600/30" />
            <div className="w-full h-px bg-amber-600/30" />
          </div>
        </div>
        {cardTier && (
          <span className="text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-slate-200">
            {tierStr}
          </span>
        )}
      </div>

      {/* Bottom: Card Name & Network */}
      <div className="flex items-end justify-between z-10 pt-2">
        <div className="max-w-[70%]">
          <p className="text-[10px] uppercase tracking-wider text-slate-300 font-medium truncate">
            {cardName}
          </p>
          <p className={`font-mono text-xs tracking-wider font-semibold ${text} mt-0.5`}>
            •••• 8899
          </p>
        </div>

        {/* Network Badge */}
        <div className="text-right">
          <span className="font-black italic text-sm tracking-wider uppercase text-white/95">
            {networkStr}
          </span>
        </div>
      </div>
    </div>
  );
};
