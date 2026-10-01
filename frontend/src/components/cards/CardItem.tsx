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
    <div className="group relative bg-white rounded-3xl border border-line shadow-card hover:shadow-lift transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top section with Visual & Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              {bankName}
            </span>
            <h3 className="text-sm font-bold text-navy-900 mt-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
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

        {/* Realistic Card Visual representation (Preserved asset) */}
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
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-line text-xs">
          <div className="bg-paper p-2.5 rounded-xl border border-line/60">
            <span className="text-[10px] text-ink-3 block font-bold uppercase tracking-wider">
              Phí thường niên
            </span>
            <span className="font-bold text-navy-900 mt-0.5 block">
              {card.annual_fee === 0
                ? '0đ phí năm'
                : card.annual_fee
                ? formatVND(card.annual_fee)
                : 'Đang cập nhật'}
            </span>
          </div>

          <div className="bg-paper p-2.5 rounded-xl border border-line/60">
            <span className="text-[10px] text-ink-3 block font-bold uppercase tracking-wider">
              Thu nhập tối thiểu
            </span>
            <span className="font-bold text-navy-900 truncate block mt-0.5">
              {card.minimum_income && card.minimum_income > 0
                ? `${formatVND(card.minimum_income)}/th`
                : 'Không yêu cầu'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-3.5 bg-paper/60 border-t border-line flex items-center justify-between gap-2 mt-auto">
        <button
          onClick={() => onViewDetail(card)}
          className="text-xs font-bold text-ink-2 hover:text-navy-900 inline-flex items-center gap-1 transition-colors py-1.5 px-2 rounded-lg hover:bg-blue-50"
        >
          <Eye className="w-3.5 h-3.5 text-ink-3" />
          <span>Xem card</span>
        </button>

        <div className="flex items-center gap-1.5">
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(card)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all inline-flex items-center gap-1 ${
                isCompared
                  ? 'bg-navy-900 text-white border-navy-900 shadow-2xs'
                  : 'bg-white text-ink-2 border-line hover:border-blue-300 hover:bg-blue-50/50'
              }`}
              title={isCompared ? 'Bỏ so sánh' : 'Thêm vào so sánh (tối đa 3 card)'}
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
                  <Check className="w-3.5 h-3.5 text-success stroke-[3]" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )
              }
            >
              {isInWallet ? 'Trong ví' : 'Lưu card'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
