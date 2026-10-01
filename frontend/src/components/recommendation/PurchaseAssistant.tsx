import React, { useState, useEffect } from 'react';
import { RecommendationRequest, RecommendationResponse } from '../../types/recommendation';
import { MerchantOut } from '../../types/merchant';
import { getMerchants, getCategories } from '../../api/merchants';
import { getRecommendation } from '../../api/recommendation';
import { formatVND } from '../../utils/formatters';
import { RecommendationResultView } from './RecommendationResultView';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorNotice } from '../common/ErrorNotice';
import {
  ShoppingBag,
  Store,
  Coins,
  Sparkles,
  Wallet,
  Check,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface PurchaseAssistantProps {
  walletCardIds: Set<string>;
  onViewDetailById: (cardId: string) => void;
  onToggleWalletById: (cardId: string) => void;
  loadingWalletCardId?: string | null;
}

export const PurchaseAssistant: React.FC<PurchaseAssistantProps> = ({
  walletCardIds,
  onViewDetailById,
  onToggleWalletById,
  loadingWalletCardId,
}) => {
  // Form values
  const [category, setCategory] = useState<string>('Online');
  const [merchantId, setMerchantId] = useState<string>('SHOPEE');
  const [amount, setAmount] = useState<number>(2000000);
  const [preference, setPreference] = useState<string>('cashback');
  const [onlyWallet, setOnlyWallet] = useState<boolean>(false);

  // Data lists
  const [categories, setCategories] = useState<string[]>([]);
  const [merchants, setMerchants] = useState<MerchantOut[]>([]);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(true);

  // Submission state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoadingOptions(true);
      try {
        const [cats, merchs] = await Promise.all([getCategories(), getMerchants()]);
        setCategories(cats);
        setMerchants(merchs);
        if (cats.length > 0 && !cats.includes(category)) {
          setCategory(cats[0]);
        }
      } catch (err) {
        console.error('Failed to load merchants or categories:', err);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadData();
  }, []);

  const handleSelectMerchant = (mId: string) => {
    setMerchantId(mId);
    if (mId === 'OTHER') return;
    const found = merchants.find((m) => m.merchant_id === mId);
    if (found && found.category && categories.includes(found.category)) {
      setCategory(found.category);
    }
  };

  const handleRunRecommendation = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload: RecommendationRequest = {
        mode: onlyWallet ? 'USE_EXISTING_CARD' : 'FIND_CARD_TO_OPEN',
        category: category || undefined,
        merchant_id: merchantId === 'OTHER' ? undefined : merchantId || undefined,
        amount: amount > 0 ? amount : undefined,
        primary_preference: preference,
      };

      const res = await getRecommendation(payload);
      setResult(res);
    } catch (err: any) {
      setError(
        err.message ||
          'Chưa tìm thấy card phù hợp. Hãy thử đổi tiêu chí hoặc xem lại các thẻ trong ví của bạn nhé.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <RecommendationResultView
        result={result}
        contextAmount={amount}
        onReset={() => setResult(null)}
        onViewDetailById={onViewDetailById}
        onToggleWalletById={onToggleWalletById}
        walletCardIds={walletCardIds}
        loadingWalletCardId={loadingWalletCardId}
      />
    );
  }

  const preferenceOptions = [
    { id: 'cashback', label: 'Hoàn tiền', desc: 'Tiền mặt trả về thẻ hàng tháng' },
    { id: 'points', label: 'Tích điểm', desc: 'Tích điểm đổi voucher & quà' },
    { id: 'discount', label: 'Giảm giá', desc: 'Trừ trực tiếp trên hóa đơn' },
    { id: 'travel', label: 'Du lịch', desc: 'Tích dặm bay, phòng chờ' },
    { id: 'low_fee', label: '0đ phí năm', desc: 'Miễn phí trọn đời' },
    { id: 'merchant_benefits', label: 'Ưu đãi quán quen', desc: 'Giảm sâu theo thương hiệu' },
  ];

  const quickPresets = [
    {
      label: '🛒 Shopee 2 Triệu',
      merchantId: 'SHOPEE',
      cat: 'Online',
      amount: 2000000,
      pref: 'cashback',
    },
    {
      label: '🚗 Grab 150k',
      merchantId: 'GRAB',
      cat: 'Dining',
      amount: 150000,
      pref: 'discount',
    },
    {
      label: '✈️ Agoda 3.5 Triệu',
      merchantId: 'AGODA',
      cat: 'Travel',
      amount: 3500000,
      pref: 'travel',
    },
    {
      label: '☕ Starbucks 120k',
      merchantId: 'STARBUCKS',
      cat: 'Dining',
      amount: 120000,
      pref: 'merchant_benefits',
    },
    {
      label: '🥦 Siêu thị 1.5 Triệu',
      merchantId: 'OTHER',
      cat: 'Supermarket',
      amount: 1500000,
      pref: 'cashback',
    },
  ];

  const quickAmounts = [
    { label: '200k', val: 200000 },
    { label: '500k', val: 500000 },
    { label: '1 Triệu', val: 1000000 },
    { label: '2 Triệu', val: 2000000 },
    { label: '5 Triệu', val: 5000000 },
    { label: '10 Triệu', val: 10000000 },
  ];

  const popularMerchantIds = ['SHOPEE', 'TIKI', 'GRAB', 'STARBUCKS', 'AGODA', 'TRAVELOKA', 'CGV', 'WINMART'];
  const popularMerchants = merchants.filter((m) => popularMerchantIds.includes(m.merchant_id));
  const otherMerchants = merchants.filter((m) => !popularMerchantIds.includes(m.merchant_id));

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-line shadow-card p-6 sm:p-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-6 pb-5 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-sun" />
            <span>Đi đâu, card gì?</span>
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-black text-navy-900 tracking-tight mt-1">
            Tôi sắp mua sắm một món đồ
          </h2>
          <p className="text-xs text-ink-2 mt-1">
            Nhập nhanh nơi mua và số tiền để xem chiếc card nào có benefit tốt nhất ngay lúc này.
          </p>
        </div>

        {/* Wallet Scope Badge */}
        <div className="self-start sm:self-center">
          <span className="text-[11px] font-bold text-ink-3 bg-paper px-3 py-1.5 rounded-xl border border-line inline-flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-blue-600" />
            <span>Ví có {walletCardIds.size} thẻ</span>
          </span>
        </div>
      </div>

      {error && <ErrorNotice message={error} className="mb-6" />}

      {/* Quick Scenario Chips */}
      <div className="mb-6 bg-paper p-4 rounded-2xl border border-line">
        <span className="text-[11px] font-bold text-ink-3 uppercase tracking-wider block mb-2.5">
          Gợi ý nhanh theo thói quen:
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setMerchantId(preset.merchantId);
                setCategory(preset.cat);
                setAmount(preset.amount);
                setPreference(preset.pref);
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-line hover:border-blue-400 hover:text-blue-700 transition-all text-navy-900 shadow-2xs"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {loadingOptions ? (
        <LoadingSpinner label="Để Cardy tải danh sách ưu đãi..." />
      ) : (
        <div className="space-y-6">
          {/* Section 1: Merchant & Category */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-blue-600" />
              <span>Nơi bạn mua sắm / Thương hiệu</span>
            </label>

            {/* Popular merchant pills */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSelectMerchant('OTHER')}
                className={`text-xs px-3.5 py-2 rounded-xl font-bold border transition-all ${
                  merchantId === 'OTHER'
                    ? 'bg-navy-900 text-white border-navy-900 shadow-2xs'
                    : 'bg-paper text-ink-2 border-line hover:bg-blue-50/50 hover:border-blue-300'
                }`}
              >
                Chung / Nơi khác
              </button>

              {popularMerchants.map((m) => {
                const isSelected = merchantId === m.merchant_id;
                return (
                  <button
                    key={m.merchant_id}
                    type="button"
                    onClick={() => handleSelectMerchant(m.merchant_id)}
                    className={`text-xs px-3.5 py-2 rounded-xl font-bold border transition-all ${
                      isSelected
                        ? 'bg-navy-900 text-white border-navy-900 shadow-2xs'
                        : 'bg-paper text-ink-2 border-line hover:bg-blue-50/50 hover:border-blue-300'
                    }`}
                  >
                    {m.merchant_name}
                  </button>
                );
              })}
            </div>

            {/* More merchants dropdown if needed */}
            {otherMerchants.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-ink-3">Hoặc chọn thương hiệu khác:</span>
                <select
                  value={merchantId}
                  onChange={(e) => handleSelectMerchant(e.target.value)}
                  className="text-xs font-bold text-navy-900 bg-white border border-line rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="OTHER">-- Chọn từ danh sách --</option>
                  {otherMerchants.map((m) => (
                    <option key={m.merchant_id} value={m.merchant_id}>
                      {m.merchant_name} ({m.category || 'Khác'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Category selection */}
            <div className="pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5 mb-2">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <span>Danh mục giao dịch</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`text-xs px-3.5 py-1.5 rounded-xl font-bold border transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white text-ink-2 border-line hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Amount */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-blue-600" />
              <span>Số tiền dự kiến thanh toán</span>
            </label>

            <div className="relative">
              <input
                type="number"
                min="0"
                step="50000"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="2000000"
                className="w-full text-xl sm:text-2xl font-black text-navy-900 px-4 py-3.5 rounded-2xl border border-line focus:outline-none focus:ring-2 focus:ring-blue-600 bg-paper"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-blue-700 text-sm">
                {formatVND(amount)}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((q) => (
                <button
                  key={q.val}
                  type="button"
                  onClick={() => setAmount(q.val)}
                  className={`text-xs px-3 py-1 rounded-xl font-bold border transition-all ${
                    amount === q.val
                      ? 'bg-navy-900 text-white border-navy-900 shadow-2xs'
                      : 'bg-white text-ink-2 border-line hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Preference */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sun" />
              <span>Điều bạn ưu tiên nhất lúc này</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {preferenceOptions.map((opt) => {
                const isSelected = preference === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPreference(opt.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-navy-900 ring-2 ring-blue-600/20 shadow-2xs'
                        : 'border-line hover:border-blue-300 bg-white text-ink-2 hover:bg-blue-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-900 block">{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3] shrink-0" />}
                    </div>
                    <span className="text-[10px] block mt-0.5 truncate text-ink-3">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Wallet Scope Toggle */}
          <div className="p-4 rounded-2xl bg-paper border border-line flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-blue-600" />
                <span>Chỉ chọn trong các card tôi đang có trong ví</span>
              </span>
              <p className="text-[11px] text-ink-3">
                {walletCardIds.size > 0
                  ? `Ví bạn hiện có ${walletCardIds.size} thẻ đang lưu`
                  : 'Ví hiện chưa có thẻ (hãy tắt tùy chọn này nếu muốn tìm trên 30+ thẻ thị trường)'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOnlyWallet(!onlyWallet)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                onlyWallet ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  onlyWallet ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Action CTA */}
          <div className="pt-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-ink-2 font-medium">
              Đang tính cho:{' '}
              <strong className="text-navy-900">{formatVND(amount)}</strong> tại{' '}
              <strong className="text-navy-900">
                {merchants.find((m) => m.merchant_id === merchantId)?.merchant_name || category}
              </strong>
            </span>

            <Button
              size="lg"
              loading={submitting}
              onClick={handleRunRecommendation}
              icon={<ArrowRight className="w-4 h-4 text-white" />}
              className="w-full sm:w-auto"
            >
              Card đi →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
