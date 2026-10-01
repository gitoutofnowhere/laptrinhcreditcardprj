import React, { useState, useEffect } from 'react';
import { CardOut } from '../types/card';
import { getCards, CardFilterParams } from '../api/cards';
import { getCategories } from '../api/merchants';
import { CardItem } from '../components/cards/CardItem';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorNotice } from '../components/common/ErrorNotice';
import { EmptyState } from '../components/common/EmptyState';
import { getBankFullName } from '../utils/formatters';
import { Search, Filter, RotateCcw, Compass } from 'lucide-react';

interface ExploreCardsPageProps {
  walletCardIds: Set<string>;
  comparedCardIds: Set<string>;
  onViewDetail: (card: CardOut) => void;
  onToggleWallet: (card: CardOut) => void;
  onToggleCompare: (card: CardOut) => void;
  loadingWalletCardId?: string | null;
}

export const ExploreCardsPage: React.FC<ExploreCardsPageProps> = ({
  walletCardIds,
  comparedCardIds,
  onViewDetail,
  onToggleWallet,
  onToggleCompare,
  loadingWalletCardId,
}) => {
  const [cards, setCards] = useState<CardOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: CardFilterParams = {};
      if (selectedBank) params.bank_id = selectedBank;
      if (selectedNetwork) params.network = selectedNetwork;
      if (selectedTier) params.card_tier = selectedTier;
      if (selectedCategory) params.category = selectedCategory;

      const data = await getCards(params);
      setCards(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách thẻ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [selectedBank, selectedNetwork, selectedTier, selectedCategory]);

  const resetFilters = () => {
    setSearch('');
    setSelectedBank('');
    setSelectedNetwork('');
    setSelectedTier('');
    setSelectedCategory('');
  };

  // Local filter for quick search
  const filteredCards = cards.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const bankFull = getBankFullName(c.bank_id).toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.bank_id.toLowerCase().includes(q) ||
      bankFull.includes(q) ||
      (c.network && c.network.toLowerCase().includes(q)) ||
      (c.card_tier && c.card_tier.toLowerCase().includes(q))
    );
  });

  const banks = [
    { id: '', label: 'Tất cả ngân hàng' },
    { id: 'VPB', label: 'VPBank' },
    { id: 'TCB', label: 'Techcombank' },
    { id: 'VCB', label: 'Vietcombank' },
    { id: 'MB', label: 'MB Bank' },
    { id: 'BIDV', label: 'BIDV' },
    { id: 'CTG', label: 'VietinBank' },
    { id: 'HSBC', label: 'HSBC Vietnam' },
  ];

  const networks = [
    { id: '', label: 'Mọi tổ chức thẻ' },
    { id: 'Visa', label: 'Visa' },
    { id: 'Mastercard', label: 'Mastercard' },
    { id: 'JCB', label: 'JCB' },
    { id: 'Napas', label: 'Napas' },
  ];

  const tiers = [
    { id: '', label: 'Mọi hạng thẻ' },
    { id: 'Classic', label: 'Chuẩn (Classic)' },
    { id: 'Gold', label: 'Vàng (Gold)' },
    { id: 'Platinum', label: 'Bạch kim (Platinum)' },
    { id: 'Signature', label: 'Signature' },
    { id: 'Infinite', label: 'Infinite' },
  ];

  return (
    <div className="space-y-6 py-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Tra cứu & Lọc thẻ</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
            30+ chiếc card ngân hàng hàng đầu
          </h1>
          <p className="text-xs text-ink-2 mt-0.5">
            Biểu phí thường niên, quyền lợi hoàn tiền và điều kiện phát hành được cập nhật minh bạch.
          </p>
        </div>

        <div className="text-xs text-ink-2 font-bold bg-white px-4 py-2 rounded-xl border border-line shadow-card self-start sm:self-auto">
          Đang hiển thị:{' '}
          <strong className="text-navy-900">{filteredCards.length} dòng thẻ</strong>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl border border-line shadow-card p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên card, ngân hàng..."
              className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-line bg-paper text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-medium"
            />
          </div>

          {/* Bank Select */}
          <div>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full text-xs font-bold text-navy-900 bg-paper px-3 py-2.5 rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {banks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          {/* Network Select */}
          <div>
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="w-full text-xs font-bold text-navy-900 bg-paper px-3 py-2.5 rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {networks.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tier Select */}
          <div>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full text-xs font-bold text-navy-900 bg-paper px-3 py-2.5 rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {tiers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories chips filter */}
        {categories.length > 0 && (
          <div className="pt-2 border-t border-line flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-ink-3 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Ngành hàng:</span>
            </span>

            <button
              type="button"
              onClick={() => setSelectedCategory('')}
              className={`text-xs px-3 py-1 rounded-lg font-bold transition-all ${
                selectedCategory === ''
                  ? 'bg-navy-900 text-white shadow-2xs'
                  : 'bg-paper text-ink-2 hover:bg-blue-50/60'
              }`}
            >
              Tất cả
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                className={`text-xs px-3 py-1 rounded-lg font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-paper text-ink-2 hover:bg-blue-50/60'
                }`}
              >
                {cat}
              </button>
            ))}

            {(selectedBank || selectedNetwork || selectedTier || selectedCategory || search) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-danger hover:text-red-700 ml-auto inline-flex items-center gap-1 font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đổi tiêu chí</span>
              </button>
            )}
          </div>
        )}
      </div>

      {error && <ErrorNotice message={error} onRetry={fetchCards} />}

      {/* Cards Grid */}
      {loading ? (
        <LoadingSpinner label="Để Cardy xem danh sách thẻ…" fullHeight />
      ) : filteredCards.length === 0 ? (
        <EmptyState
          title="Chưa có card nào ở đây."
          description="Thử đổi tiêu chí xem nhé. Nới lỏng bộ lọc ngân hàng hoặc danh mục để tìm thấy thẻ phù hợp."
          actionLabel="Đổi tiêu chí"
          onAction={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCards.map((card) => (
            <CardItem
              key={card.card_id}
              card={card}
              isInWallet={walletCardIds.has(card.card_id)}
              isCompared={comparedCardIds.has(card.card_id)}
              onViewDetail={onViewDetail}
              onToggleWallet={onToggleWallet}
              onToggleCompare={onToggleCompare}
              loadingWallet={loadingWalletCardId === card.card_id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
