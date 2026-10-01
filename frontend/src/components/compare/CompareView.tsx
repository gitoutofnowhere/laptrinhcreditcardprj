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
      <div className="text-center py-16 bg-white rounded-3xl border border-line p-8 shadow-card">
        <Scale className="w-12 h-12 text-ink-3 mx-auto mb-3" />
        <h3 className="text-base font-display font-extrabold text-ink">Chưa chọn chiếc card nào</h3>
        <p className="text-xs text-ink-3 mt-1 max-w-sm mx-auto">
          Chọn tối đa 3 chiếc card để đặt cạnh nhau so sánh phí, điều kiện và ưu đãi nhé.
        </p>
        {onAddMore && (
          <div className="mt-4">
            <Button size="sm" onClick={onAddMore} className="bg-blue-600 text-white hover:bg-blue-700 font-bold">
              Khám phá danh sách card
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner label="Để Cardy đặt cạnh nhau so thử…" fullHeight />;
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
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-ink tracking-tight">
            So sánh card
          </h2>
          <p className="text-xs text-ink-3 mt-0.5">
            Đang phân vân? Đặt tối đa 3 card cạnh nhau để so quyền lợi, phí thường niên và điều kiện mở thẻ.
          </p>
        </div>

        {cards.length < 3 && onAddMore && (
          <Button variant="outline" size="sm" onClick={onAddMore} icon={<Plus className="w-3.5 h-3.5" />}>
            + Thêm card so sánh ({cards.length}/3)
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
                className="bg-white rounded-2xl border border-line shadow-card p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Card Visual & Remove button */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {getBankFullName(item.bank_name)}
                    </span>
                    <button
                      onClick={() => onRemoveCard(item.card_id)}
                      className="text-ink-3 hover:text-ink p-1 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Bỏ so sánh"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-display font-bold text-ink text-sm mb-3 line-clamp-1">{item.name}</h3>

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
                  <div className="space-y-3.5 text-xs pt-3 border-t border-line">
                    {/* Annual Fee */}
                    <div className="flex items-center justify-between pb-2 border-b border-line">
                      <span className="text-ink-3 font-medium">Phí thường niên</span>
                      <div className="text-right">
                        <span
                          className={`font-bold ${
                            isLowestFee ? 'text-emerald-600' : 'text-ink'
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
                            Rẻ nhất nhóm
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Minimum Income */}
                    <div className="flex items-center justify-between pb-2 border-b border-line">
                      <span className="text-ink-3 font-medium">Thu nhập tối thiểu</span>
                      <span className="font-semibold text-ink">
                        {item.minimum_income && item.minimum_income > 0
                          ? `${formatVND(item.minimum_income)}/th`
                          : 'Không yêu cầu'}
                      </span>
                    </div>

                    {/* Tier & Network */}
                    <div className="flex items-center justify-between pb-2 border-b border-line">
                      <span className="text-ink-3 font-medium">Hạng & Tổ chức</span>
                      <span className="font-semibold text-ink">
                        {item.card_tier || 'Classic'} • {item.network || 'Visa'}
                      </span>
                    </div>

                    {/* Deals count */}
                    <div className="flex items-center justify-between pb-2 border-b border-line">
                      <span className="text-ink-3 font-medium">Ưu đãi thương hiệu</span>
                      <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {item.merchant_deals_count} điểm đối tác
                      </span>
                    </div>

                    {/* Top Benefits list */}
                    <div className="pt-1">
                      <span className="text-ink-3 font-medium block mb-2">Ưu đãi nổi bật:</span>
                      {item.top_benefits.length > 0 ? (
                        <div className="space-y-1.5">
                          {item.top_benefits.map((b, idx) => (
                            <div
                              key={idx}
                              className="text-[11px] bg-paper p-2 rounded-lg text-ink-2 border border-line flex items-start gap-1.5"
                            >
                              <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-ink-3 italic">
                          Chưa có thông tin ưu đãi riêng.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-line flex items-center gap-2">
                  {cardObj && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onViewDetail(cardObj)}
                    >
                      Xem card
                    </Button>
                  )}
                  {cardObj && onToggleWallet && (
                    <Button
                      variant={isInWallet ? 'secondary' : 'primary'}
                      size="sm"
                      className={`flex-1 ${!isInWallet ? 'bg-blue-600 hover:bg-blue-700 text-white font-bold' : ''}`}
                      onClick={() => onToggleWallet(cardObj)}
                      icon={isInWallet ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Plus className="w-3.5 h-3.5" />}
                    >
                      {isInWallet ? 'Đã trong ví' : '+ Thêm ví'}
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
