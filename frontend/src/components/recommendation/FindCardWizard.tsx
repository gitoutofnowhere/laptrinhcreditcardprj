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
  CreditCard,
  BadgeDollarSign,
  Sparkles,
  ShoppingBag,
  Store,
  Check,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface FindCardWizardProps {
  walletCardIds: Set<string>;
  onViewDetailById: (cardId: string) => void;
  onToggleWalletById: (cardId: string) => void;
  loadingWalletCardId?: string | null;
}

export const FindCardWizard: React.FC<FindCardWizardProps> = ({
  walletCardIds,
  onViewDetailById,
  onToggleWalletById,
  loadingWalletCardId,
}) => {
  // Form values
  const [monthlyIncome, setMonthlyIncome] = useState<number>(20000000);
  const [primaryPreference, setPrimaryPreference] = useState<string>('cashback');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Online', 'Dining']);
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>(['SHOPEE']);
  const [maxAnnualFee, setMaxAnnualFee] = useState<number | undefined>(undefined);

  // Dynamic database options
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
      } catch (err) {
        console.error('Failed to load categories/merchants:', err);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadData();
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleMerchant = (mId: string) => {
    setSelectedMerchants((prev) =>
      prev.includes(mId) ? prev.filter((m) => m !== mId) : [...prev, mId]
    );
  };

  const handleRun = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload: RecommendationRequest = {
        mode: 'FIND_CARD_TO_OPEN',
        monthly_income: monthlyIncome > 0 ? monthlyIncome : undefined,
        primary_preference: primaryPreference,
        favorite_categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        favorite_merchants: selectedMerchants.length > 0 ? selectedMerchants : undefined,
        max_annual_fee: maxAnnualFee !== undefined ? maxAnnualFee : undefined,
      };

      const res = await getRecommendation(payload);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Không thể tìm thấy thẻ phù hợp với tiêu chí hiện tại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <RecommendationResultView
        result={result}
        onReset={() => setResult(null)}
        onViewDetailById={onViewDetailById}
        onToggleWalletById={onToggleWalletById}
        walletCardIds={walletCardIds}
        loadingWalletCardId={loadingWalletCardId}
      />
    );
  }

  const preferenceOptions = [
    { id: 'cashback', label: 'Hoàn tiền tối đa', desc: 'Thích nhận tiền hoàn về tài khoản mỗi tháng' },
    { id: 'points', label: 'Tích điểm đổi quà', desc: 'Tích lũy điểm thưởng mua sắm và ăn uống' },
    { id: 'travel', label: 'Du lịch & Dặm bay', desc: 'Phòng chờ thương gia, dặm Lotusmiles' },
    { id: 'low_fee', label: 'Phí thường niên 0đ', desc: 'Miễn phí thường niên trọn đời' },
    { id: 'merchant_benefits', label: 'Ưu đãi thương hiệu', desc: 'Giảm giá sâu Shopee, Grab, Starbucks...' },
  ];

  const incomePresets = [
    { label: '8 Triệu', val: 8000000 },
    { label: '15 Triệu', val: 15000000 },
    { label: '25 Triệu', val: 25000000 },
    { label: '40 Triệu', val: 40000000 },
    { label: '70+ Triệu', val: 70000000 },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-6 pb-5 border-b border-slate-100">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Tư vấn mở thẻ tín dụng mới</span>
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
          Tôi muốn tìm một chiếc thẻ mới để mở
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Sàng lọc điều kiện thu nhập, biểu phí thường niên và thói quen chi tiêu để gợi ý thẻ có tỷ
          lệ duyệt cao và quyền lợi tương xứng.
        </p>
      </div>

      {error && <ErrorNotice message={error} className="mb-6" />}

      <div className="space-y-6">
        {/* Monthly Income Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BadgeDollarSign className="w-4 h-4 text-teal-600" />
              <span>Thu nhập trung bình hàng tháng</span>
            </label>
            <span className="text-xs text-slate-400">Dùng để xác định điều kiện phát hành</span>
          </div>

          <div className="relative">
            <input
              type="number"
              min="0"
              step="1000000"
              value={monthlyIncome || ''}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full text-xl sm:text-2xl font-black text-slate-900 px-4 py-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50"
              placeholder="20000000"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-teal-700">
              {formatVND(monthlyIncome)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {incomePresets.map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => setMonthlyIncome(p.val)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-all ${
                  monthlyIncome === p.val
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Benefit Preference */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Quyền lợi bạn ưu tiên nhất</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {preferenceOptions.map((opt) => {
              const isSelected = primaryPreference === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPrimaryPreference(opt.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/40 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-teal-400" />}
                  </div>
                  <span
                    className={`text-[11px] block mt-1 ${
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

        {/* Categories Multi-select */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-teal-600" />
            <span>Danh mục thường xuyên chi tiêu (chọn một hoặc nhiều)</span>
          </label>

          {loadingOptions ? (
            <LoadingSpinner label="Đang tải danh mục..." size="sm" />
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check className="w-3 h-3 text-teal-200" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Favorite Merchants */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-teal-600" />
            <span>Thương hiệu yêu thích của bạn (tùy chọn)</span>
          </label>

          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
            {merchants.map((m) => {
              const isSelected = selectedMerchants.includes(m.merchant_id);
              return (
                <button
                  key={m.merchant_id}
                  type="button"
                  onClick={() => toggleMerchant(m.merchant_id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{m.merchant_name}</span>
                  {isSelected && <Check className="w-3 h-3 text-teal-300" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Annual Fee Limit */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-teal-600" />
            <span>Giới hạn phí thường niên chấp nhận</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Không giới hạn', val: undefined },
              { label: 'Miễn phí (0 ₫)', val: 0 },
              { label: 'Dưới 500k', val: 500000 },
              { label: 'Dưới 1 Triệu', val: 1000000 },
            ].map((f, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setMaxAnnualFee(f.val)}
                className={`text-xs p-2.5 rounded-xl font-semibold border text-center transition-all ${
                  maxAnnualFee === f.val
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end">
        <Button
          size="lg"
          loading={submitting}
          onClick={handleRun}
          icon={<Sparkles className="w-4 h-4 text-teal-400" />}
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold"
        >
          Tìm thẻ phù hợp với tôi
        </Button>
      </div>
    </div>
  );
};
