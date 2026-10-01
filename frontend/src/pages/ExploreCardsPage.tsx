import React, { useState, useEffect } from 'react';
import { CardOut } from '../types/card';
import { getCards, CardFilterParams } from '../api/cards';
import { getCategories } from '../api/merchants';
import { CardItem } from '../components/cards/CardItem';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorNotice } from '../components/common/ErrorNotice';
import { formatVND, getBankFullName } from '../utils/formatters';
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Tra cứu & Lọc thông minh</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Khám phá 30+ dòng thẻ tín dụng hàng đầu
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dữ liệu quyền lợi, hạn mức, phí thường niên và điều kiện phát hành được cập nhật mới nhất.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-semibold bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm self-start sm:self-auto">
          Đang hiển thị:{' '}
          <strong className="text-slate-900">{filteredCards.length} dòng thẻ</strong>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên thẻ, ngân hàng..."
              className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          {/* Bank Select */}
          <div>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
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
              className="w-full text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
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
              className="w-full text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
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
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Ngành hàng:</span>
            </span>

            <button
              type="button"
              onClick={() => setSelectedCategory('')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedCategory === ''
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}

            {(selectedBank || selectedNetwork || selectedTier || selectedCategory || search) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-800 ml-auto inline-flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại bộ lọc</span>
              </button>
            )}
          </div>
        )}
      </div>

      {error && <ErrorNotice message={error} onRetry={fetchCards} />}

      {/* Cards Grid */}
      {loading ? (
        <LoadingSpinner label="Đang tải danh sách thẻ..." fullHeight />
      ) : filteredCards.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy chiếc thẻ nào phù hợp</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Hãy thử nới lỏng các bộ lọc ngân hàng, hạng thẻ hoặc danh mục ưu đãi.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 text-xs font-bold text-teal-700 hover:underline"
          >
            Xem lại tất cả thẻ
          </button>
        </div>
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
