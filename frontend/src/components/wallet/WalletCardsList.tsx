import React, { useState } from 'react';
import { WalletCardOut } from '../../types/wallet';
import { CardOut } from '../../types/card';
import { CreditCardVisual } from '../cards/CreditCardVisual';
import { formatVND } from '../../utils/formatters';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { Trash2, Eye, Plus, Wallet, ShieldAlert } from 'lucide-react';

interface WalletCardsListProps {
  walletCards: WalletCardOut[];
  onOpenAddModal: () => void;
  onRemoveCard: (cardId: string) => Promise<void>;
  onViewDetail: (card: CardOut) => void;
}

export const WalletCardsList: React.FC<WalletCardsListProps> = ({
  walletCards,
  onOpenAddModal,
  onRemoveCard,
  onViewDetail,
}) => {
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (cardId: string) => {
    if (!window.confirm('Bạn có chắc muốn gỡ chiếc card này khỏi ví không?')) return;
    setRemovingId(cardId);
    try {
      await onRemoveCard(cardId);
    } finally {
      setRemovingId(null);
    }
  };

  if (walletCards.length === 0) {
    return (
      <EmptyState
        icon={<Wallet className="w-6 h-6 text-ink-3" />}
        title="Ví chưa có card nào"
        description="Thêm những chiếc card bạn đang dùng vào ví để Cardy chỉ cách quẹt tối đa hoàn tiền nhé."
        actionLabel="+ Thêm card vào ví"
        onAction={onOpenAddModal}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <div>
          <h3 className="text-base font-display font-extrabold text-ink tracking-tight">
            Card trong ví của bạn ({walletCards.length})
          </h3>
          <p className="text-xs text-ink-3">
            Cardy sẽ dựa trên những chiếc card này để gợi ý quẹt thẻ cho bạn.
          </p>
        </div>

        <Button size="sm" onClick={onOpenAddModal} icon={<Plus className="w-3.5 h-3.5" />} className="bg-blue-600 text-white hover:bg-blue-700 font-bold">
          + Thêm card
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {walletCards.map((item) => {
          const card = item.card;
          if (!card) return null;
          const isRemoving = removingId === item.card_id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-line shadow-card p-4 flex flex-col justify-between hover:shadow-lift transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {card.bank_id}
                    </span>
                    <h4 className="text-xs font-display font-bold text-ink mt-1 line-clamp-1">
                      {card.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleRemove(item.card_id)}
                    disabled={isRemoving}
                    className="text-ink-3 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50"
                    title="Gỡ khỏi ví"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex justify-center my-3 cursor-pointer" onClick={() => onViewDetail(card)}>
                  <CreditCardVisual
                    cardName={card.name}
                    bankId={card.bank_id}
                    network={card.network}
                    cardTier={card.card_tier}
                    annualFee={card.annual_fee}
                    size="sm"
                  />
                </div>

                <div className="pt-2 border-t border-line flex items-center justify-between text-xs text-ink-3">
                  <span>Phí thường niên:</span>
                  <span className="font-semibold text-ink">
                    {card.annual_fee === 0 ? '0 ₫' : formatVND(card.annual_fee)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-line flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => onViewDetail(card)}
                  icon={<Eye className="w-3.5 h-3.5" />}
                >
                  Xem card
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
