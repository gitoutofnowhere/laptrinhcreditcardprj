import React, { useEffect, useState } from 'react';
import { CardOut, CardCompareItem } from '../../types/card';
import { compareCards } from '../../api/cards';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorNotice } from '../common/ErrorNotice';
import { Button } from '../common/Button';
import { formatVND, getBankFullName } from '../../utils/formatters';
import { CreditCardVisual } from '../cards/CreditCardVisual';
import { Check, X, Shield, Gift, Plus, Scale } from 'lucide-react';

interface CompareViewProps {
  cards: CardOut[];
  onAddMore?: () => void;
  onRemoveCard: (cardId: string) => void;
  onViewDetail: (card: CardOut) => void;
  walletCardIds?: Set<string>;
  onToggleWallet?: (card: CardOut) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  cards,
  onAddMore,
  onRemoveCard,
  onViewDetail,
  walletCardIds = new Set(),
  onToggleWallet,
}) => {
  const [items, setItems] = useState<CardCompareItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cards.length === 0) {
      setItems([]);
      return;
    }

    const fetchComparison = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await compareCards(cards.map((c) => c.card_id));
        setItems(res.compared_cards);
      } catch (err: any) {
        setError(err.message || 'Không thể so sánh các thẻ đã chọn.');
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [cards]);

  if (cards.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
        <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">Chưa có thẻ nào được chọn để so sánh</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Chọn tối đa 3 thẻ từ mục Khám phá thẻ hoặc Đề xuất để so sánh quyền lợi và điều kiện mở thẻ.
        </p>
        {onAddMore && (
          <div className="mt-4">
            <Button size="sm" onClick={onAddMore}>
              Khám phá danh sách thẻ
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner label="Đang tải dữ liệu đối chiếu thẻ..." fullHeight />;
  }

  if (error) {
    return <ErrorNotice message={error} />;
  }

  // Find minimum annual fee among compared cards for highlighting
  const fees = items.map((i) => i.annual_fee ?? Infinity);
  const lowestFee = Math.min(...fees);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Đối chiếu & So sánh chi tiết
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            So sánh tối đa 3 thẻ tín dụng dựa trên quyền lợi cốt lõi, phí thường niên và điều kiện
            thu nhập
          </p>
        </div>

        {cards.length < 3 && onAddMore && (
          <Button variant="outline" size="sm" onClick={onAddMore} icon={<Plus className="w-3.5 h-3.5" />}>
            Thêm thẻ so sánh ({cards.length}/3)
          </Button>
        )}
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[700px] md:min-w-0">
          {items.map((item) => {
            const cardObj = cards.find((c) => c.card_id === item.card_id);
            const isLowestFee = item.annual_fee !== null && item.annual_fee === lowestFee;
            const isInWallet = walletCardIds.has(item.card_id);

            return (
              <div
                key={item.card_id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Card Visual & Remove button */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      {getBankFullName(item.bank_name)}
                    </span>
                    <button
                      onClick={() => onRemoveCard(item.card_id)}
                      className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Gỡ khỏi so sánh"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-3 line-clamp-1">{item.name}</h3>

                  <div className="flex justify-center mb-5">
                    <CreditCardVisual
                      cardName={item.name}
                      bankName={getBankFullName(item.bank_name)}
                      network={item.network}
                      cardTier={item.card_tier}
                      annualFee={item.annual_fee}
                      size="sm"
                    />
                  </div>

                  {/* Attribute Comparison List */}
                  <div className="space-y-3.5 text-xs pt-3 border-t border-slate-100">
                    {/* Annual Fee */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Phí thường niên</span>
                      <div className="text-right">
                        <span
                          className={`font-bold ${
                            isLowestFee ? 'text-emerald-600' : 'text-slate-900'
                          }`}
                        >
                          {item.annual_fee === 0
                            ? 'Miễn phí (0 ₫)'
                            : item.annual_fee
                            ? formatVND(item.annual_fee)
                            : 'Đang cập nhật'}
                        </span>
                        {isLowestFee && item.annual_fee !== null && (
                          <span className="block text-[10px] text-emerald-600 font-semibold">
                            Thấp nhất nhóm
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Minimum Income */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Thu nhập tối thiểu</span>
                      <span className="font-semibold text-slate-800">
                        {item.minimum_income && item.minimum_income > 0
                          ? `${formatVND(item.minimum_income)}/th`
                          : 'Không yêu cầu'}
                      </span>
                    </div>

                    {/* Tier & Network */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Hạng & Tổ chức</span>
                      <span className="font-semibold text-slate-800">
                        {item.card_tier || 'Classic'} • {item.network || 'Visa'}
                      </span>
                    </div>

                    {/* Deals count */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Ưu đãi thương hiệu</span>
                      <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {item.merchant_deals_count} điểm đối tác
                      </span>
                    </div>

                    {/* Top Benefits list */}
                    <div className="pt-1">
                      <span className="text-slate-500 font-medium block mb-2">Quyền lợi tiêu biểu:</span>
                      {item.top_benefits.length > 0 ? (
                        <div className="space-y-1.5">
                          {item.top_benefits.map((b, idx) => (
                            <div
                              key={idx}
                              className="text-[11px] bg-slate-50 p-2 rounded-lg text-slate-700 border border-slate-100 flex items-start gap-1.5"
                            >
                              <Shield className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">
                          Chưa có ghi nhận ưu đãi đặc thù theo danh mục.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  {cardObj && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onViewDetail(cardObj)}
                    >
                      Chi tiết
                    </Button>
                  )}
                  {cardObj && onToggleWallet && (
                    <Button
                      variant={isInWallet ? 'secondary' : 'primary'}
                      size="sm"
                      className="flex-1"
                      onClick={() => onToggleWallet(cardObj)}
                      icon={isInWallet ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Plus className="w-3.5 h-3.5" />}
                    >
                      {isInWallet ? 'Trong ví' : 'Thêm ví'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
