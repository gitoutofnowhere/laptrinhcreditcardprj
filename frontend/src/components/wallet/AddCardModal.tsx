import React, { useState, useEffect } from 'react';
import { CardOut } from '../../types/card';
import { getCards } from '../../api/cards';
import { Modal } from '../common/Modal';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../common/Button';
import { formatVND } from '../../utils/formatters';
import { CreditCardVisual } from '../cards/CreditCardVisual';
import { Search, Plus, Check } from 'lucide-react';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownedCardIds: Set<string>;
  onAddCard: (cardId: string) => Promise<void>;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  onClose,
  ownedCardIds,
  onAddCard,
}) => {
  const [allCards, setAllCards] = useState<CardOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const data = await getCards();
        setAllCards(data);
      } catch (err) {
        console.error('Failed to load cards:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [isOpen]);

  const filteredCards = allCards.filter((c) => {
    const q = search.toLowerCase();
    const matchesQuery =
      c.name.toLowerCase().includes(q) ||
      c.bank_id.toLowerCase().includes(q) ||
      (c.network && c.network.toLowerCase().includes(q));
    return matchesQuery;
  });

  const handleAdd = async (cardId: string) => {
    setAddingId(cardId);
    try {
      await onAddCard(cardId);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm card vào ví"
      subtitle="Chọn những chiếc card bạn đang có để Cardy gợi ý quẹt thẻ chuẩn hơn."
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên thẻ hoặc ngân hàng (VD: VPBank, Shopee, Techcombank)..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-line bg-paper focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        {/* Card list */}
        {loading ? (
          <LoadingSpinner label="Để Cardy tải danh sách card…" fullHeight />
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-8 text-xs text-ink-3">
            Không tìm thấy card nào phù hợp từ khóa này.
          </div>
        ) : (
          <div className="max-h-[50vh] overflow-y-auto space-y-2.5 pr-1">
            {filteredCards.map((card) => {
              const isOwned = ownedCardIds.has(card.card_id);
              const isAdding = addingId === card.card_id;

              return (
                <div
                  key={card.card_id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-line bg-white hover:border-blue-200 transition-all gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block shrink-0">
                      <CreditCardVisual
                        cardName={card.name}
                        bankId={card.bank_id}
                        network={card.network}
                        cardTier={card.card_tier}
                        size="sm"
                        className="!w-24 !h-16 !p-2 !rounded-lg text-[8px]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {card.bank_id}
                        </span>
                        <span className="text-[10px] text-ink-3">
                          {card.network} • {card.card_tier || 'Classic'}
                        </span>
                      </div>
                      <h4 className="text-xs font-display font-bold text-ink mt-0.5 line-clamp-1">
                        {card.name}
                      </h4>
                      <p className="text-[11px] text-ink-3">
                        Phí thường niên:{' '}
                        {card.annual_fee === 0 ? '0 ₫' : formatVND(card.annual_fee)}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isOwned ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã có trong ví</span>
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        loading={isAdding}
                        onClick={() => handleAdd(card.card_id)}
                        icon={<Plus className="w-3.5 h-3.5" />}
                        className="bg-blue-600 text-white hover:bg-blue-700 font-bold"
                      >
                        + Thêm vào ví
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};
