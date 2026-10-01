import React, { useState, useEffect } from 'react';
import { RecommendationRequest, RecommendationResponse } from '../../types/recommendation';
import { MerchantOut } from '../../types/merchant';
import { getMerchants, getCategories } from '../../api/merchants';
import { getRecommendation } from '../../api/recommendation';
import { formatVND, getBankFullName } from '../../utils/formatters';
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
  Tag,
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
          'Không thể tìm thấy thẻ phù hợp. Hãy thử thay đổi bộ lọc hoặc kiểm tra lại ví của bạn.'
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
    { id: 'low_fee', label: 'Phí thường niên 0đ', desc: 'Miễn phí trọn đời' },
    { id: 'merchant_benefits', label: 'Ưu đãi đối tác', desc: 'Giảm giá sâu theo thương hiệu' },
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
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-6 pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Trợ lý quẹt thẻ tức thì</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Tôi sắp thực hiện một giao dịch
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Nhập nhanh nơi mua và số tiền để biết chiếc thẻ nào đem lại nhiều tiền hoàn nhất.
          </p>
        </div>

        {/* Wallet Scope Badge */}
        <div className="self-start sm:self-center">
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 inline-flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-teal-600" />
            <span>Ví có {walletCardIds.size} thẻ</span>
          </span>
        </div>
      </div>

      {error && <ErrorNotice message={error} className="mb-6" />}

      {/* Quick Scenario Chips */}
      <div className="mb-6 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Kịch bản nhanh thường gặp:
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
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 transition-all text-slate-700 shadow-2xs hover:shadow-xs"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {loadingOptions ? (
        <LoadingSpinner label="Đang tải dữ liệu đối tác & danh mục..." />
      ) : (
        <div className="space-y-6">
          {/* Section 1: Merchant & Category */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-teal-600" />
              <span>Nơi bạn mua sắm / Thương hiệu</span>
            </label>

            {/* Popular merchant pills */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSelectMerchant('OTHER')}
                className={`text-xs px-3 py-2 rounded-xl font-bold border transition-all ${
                  merchantId === 'OTHER'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
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
                    className={`text-xs px-3 py-2 rounded-xl font-bold border transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
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
                <span className="text-xs text-slate-400">Hoặc chọn thương hiệu khác:</span>
                <select
                  value={merchantId}
                  onChange={(e) => handleSelectMerchant(e.target.value)}
                  className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900"
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
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
                <ShoppingBag className="w-4 h-4 text-teal-600" />
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
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-all ${
                        isSelected
                          ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
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
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-teal-600" />
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
                className="w-full text-xl sm:text-2xl font-black text-slate-900 px-4 py-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-teal-700 text-sm">
                {formatVND(amount)}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((q) => (
                <button
                  key={q.val}
                  type="button"
                  onClick={() => setAmount(q.val)}
                  className={`text-xs px-3 py-1 rounded-xl font-medium border transition-all ${
                    amount === q.val
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Preference */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" />
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
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold block">{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                    </div>
                    <span
                      className={`text-[10px] block mt-0.5 truncate ${
                        isSelected ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Wallet Scope Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-teal-600" />
                <span>Chỉ chọn trong các thẻ tôi đang sở hữu</span>
              </span>
              <p className="text-[11px] text-slate-500">
                {walletCardIds.size > 0
                  ? `Ví bạn hiện có ${walletCardIds.size} thẻ đang lưu`
                  : 'Ví hiện chưa có thẻ (hãy tắt tùy chọn này nếu muốn tìm thẻ trên thị trường)'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOnlyWallet(!onlyWallet)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                onlyWallet ? 'bg-teal-600' : 'bg-slate-300'
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
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Đang tính cho:{' '}
              <strong className="text-slate-900">{formatVND(amount)}</strong> tại{' '}
              <strong className="text-slate-900">
                {merchants.find((m) => m.merchant_id === merchantId)?.merchant_name || category}
              </strong>
            </span>

            <Button
              size="lg"
              loading={submitting}
              onClick={handleRunRecommendation}
              icon={<Sparkles className="w-4 h-4 text-teal-400" />}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold"
            >
              Xem thẻ nên dùng ngay
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
