import React from 'react';
import { CardOut } from '../../types/card';
import { CreditCardVisual } from './CreditCardVisual';
import { formatVND, getTierBadgeStyle, getBankFullName } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Plus, Check, Eye, Scale } from 'lucide-react';

interface CardItemProps {
  card: CardOut;
  isInWallet?: boolean;
  isCompared?: boolean;
  onViewDetail: (card: CardOut) => void;
  onToggleWallet?: (card: CardOut) => void;
  onToggleCompare?: (card: CardOut) => void;
  loadingWallet?: boolean;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  isInWallet = false,
  isCompared = false,
  onViewDetail,
  onToggleWallet,
  onToggleCompare,
  loadingWallet = false,
}) => {
  const tierStyle = getTierBadgeStyle(card.card_tier);
  const bankName = getBankFullName(card.bank_id);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top section with Visual & Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
              {bankName}
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-1.5 line-clamp-1 group-hover:text-teal-700 transition-colors">
              {card.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            {card.card_tier && (
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}
              >
                {card.card_tier}
              </span>
            )}
          </div>
        </div>

        {/* Realistic Card Visual representation */}
        <div className="my-3 flex justify-center cursor-pointer" onClick={() => onViewDetail(card)}>
          <CreditCardVisual
            cardName={card.name}
            bankId={card.bank_id}
            bankName={bankName}
            network={card.network}
            cardTier={card.card_tier}
            annualFee={card.annual_fee}
            size="sm"
            className="hover:scale-[1.02] transition-transform duration-200 shadow-sm hover:shadow-md"
          />
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div className="bg-slate-50/70 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-medium">Phí thường niên</span>
            <span className="font-bold text-slate-800">
              {card.annual_fee === 0
                ? 'Miễn phí trọn đời (0 ₫)'
                : card.annual_fee
                ? formatVND(card.annual_fee)
                : 'Đang cập nhật'}
            </span>
          </div>

          <div className="bg-slate-50/70 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-medium">Thu nhập tối thiểu</span>
            <span className="font-semibold text-slate-700 truncate block">
              {card.minimum_income && card.minimum_income > 0
                ? `${formatVND(card.minimum_income)}/th`
                : 'Không yêu cầu'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <button
          onClick={() => onViewDetail(card)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 transition-colors py-1.5 px-2 rounded-lg hover:bg-slate-100"
        >
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>Chi tiết</span>
        </button>

        <div className="flex items-center gap-1.5">
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(card)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all inline-flex items-center gap-1 ${
                isCompared
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title={isCompared ? 'Bỏ so sánh' : 'Thêm vào so sánh (tối đa 3 thẻ)'}
            >
              <Scale className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isCompared ? 'Đang chọn' : 'So sánh'}</span>
            </button>
          )}

          {onToggleWallet && (
            <Button
              variant={isInWallet ? 'secondary' : 'primary'}
              size="sm"
              loading={loadingWallet}
              onClick={() => onToggleWallet(card)}
              icon={
                isInWallet ? (
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )
              }
              className={isInWallet ? 'text-teal-800 bg-teal-50 border-teal-200 font-semibold' : 'font-semibold'}
            >
              {isInWallet ? 'Trong ví' : 'Thêm ví'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
