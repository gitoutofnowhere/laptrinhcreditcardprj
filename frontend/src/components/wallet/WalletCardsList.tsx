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
    if (!window.confirm('Bạn có chắc muốn gỡ thẻ này khỏi ví cá nhân?')) return;
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
        icon={<Wallet className="w-6 h-6 text-slate-400" />}
        title="Ví của bạn hiện đang trống"
        description="Thêm những chiếc thẻ tín dụng bạn đang có trong ví để nhận gợi ý quẹt thẻ tối ưu cho từng danh mục chi tiêu."
        actionLabel="Thêm chiếc thẻ đầu tiên"
        onAction={onOpenAddModal}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Thẻ trong ví của bạn ({walletCards.length})
          </h3>
          <p className="text-xs text-slate-500">
            Hệ thống sẽ dựa trên những chiếc thẻ này để phân bổ giao dịch thông minh.
          </p>
        </div>

        <Button size="sm" onClick={onOpenAddModal} icon={<Plus className="w-3.5 h-3.5" />}>
          Thêm thẻ
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
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      {card.bank_id}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                      {card.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleRemove(item.card_id)}
                    disabled={isRemoving}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50"
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

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Phí thường niên:</span>
                  <span className="font-semibold text-slate-800">
                    {card.annual_fee === 0 ? '0 ₫' : formatVND(card.annual_fee)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => onViewDetail(card)}
                  icon={<Eye className="w-3.5 h-3.5" />}
                >
                  Xem quyền lợi
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
