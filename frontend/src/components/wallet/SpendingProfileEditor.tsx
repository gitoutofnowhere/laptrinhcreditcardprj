import React, { useState, useEffect } from 'react';
import { SpendingProfileOut, SpendingCategoryItem } from '../../types/spending';
import { getSpendingProfile, updateSpendingProfile } from '../../api/spendingProfile';
import { getCategories } from '../../api/merchants';
import { formatVND } from '../../utils/formatters';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorNotice } from '../common/ErrorNotice';
import { PieChart, Save, Plus, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';

interface SpendingProfileEditorProps {
  onProfileUpdated?: (profile: SpendingProfileOut) => void;
}

export const SpendingProfileEditor: React.FC<SpendingProfileEditorProps> = ({
  onProfileUpdated,
}) => {
  const [profile, setProfile] = useState<SpendingProfileOut | null>(null);
  const [items, setItems] = useState<SpendingCategoryItem[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultCategories = [
    { category: 'Online', monthly_amount: 5000000 },
    { category: 'Dining', monthly_amount: 3000000 },
    { category: 'Supermarket', monthly_amount: 4000000 },
    { category: 'Travel', monthly_amount: 2000000 },
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profData, cats] = await Promise.all([
          getSpendingProfile(),
          getCategories(),
        ]);
        setProfile(profData);
        setAllCategories(cats);

        if (profData.items && profData.items.length > 0) {
          setItems(
            profData.items.map((i) => ({
              category: i.category,
              monthly_amount: i.monthly_amount,
            }))
          );
        } else {
          // Initialize with sensible defaults
          setItems(defaultCategories);
        }
      } catch (err: any) {
        setError(err.message || 'Không thể tải hồ sơ chi tiêu.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAmountChange = (index: number, val: number) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], monthly_amount: Math.max(0, val) };
      return copy;
    });
    setSavedSuccess(false);
  };

  const handleCategoryChange = (index: number, newCat: string) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], category: newCat };
      return copy;
    });
    setSavedSuccess(false);
  };

  const handleAddItem = () => {
    const existingCats = new Set(items.map((i) => i.category));
    const availableCat = allCategories.find((c) => !existingCats.has(c)) || 'General';
    setItems((prev) => [...prev, { category: availableCat, monthly_amount: 1000000 }]);
    setSavedSuccess(false);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setSavedSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateSpendingProfile(items);
      setProfile(updated);
      setSavedSuccess(true);
      if (onProfileUpdated) {
        onProfileUpdated(updated);
      }
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Không thể lưu hồ sơ chi tiêu.');
    } finally {
      setSaving(false);
    }
  };

  const total = items.reduce((acc, curr) => acc + (curr.monthly_amount || 0), 0);

  if (loading) {
    return <LoadingSpinner label="Đang tải hồ sơ chi tiêu..." fullHeight />;
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Hồ sơ chi tiêu hàng tháng
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Nhập ngân sách chi tiêu ước tính theo từng nhóm ngành để thuật toán tính toán thẻ tối ưu nhất.
          </p>
        </div>

        <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200/80 text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Tổng chi tiêu hàng tháng
          </span>
          <span className="text-lg font-black text-slate-900">{formatVND(total)}</span>
        </div>
      </div>

      {error && <ErrorNotice message={error} className="my-4" />}

      {savedSuccess && (
        <div className="my-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Đã cập nhật hồ sơ chi tiêu thành công! Thuật toán tối ưu ví đã được đồng bộ.</span>
        </div>
      )}

      {/* Spending categories list */}
      <div className="space-y-3 mt-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70"
          >
            {/* Category Selector */}
            <div className="sm:w-1/3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Danh mục
              </label>
              <select
                value={item.category}
                onChange={(e) => handleCategoryChange(idx, e.target.value)}
                className="w-full text-xs font-bold text-slate-800 bg-white px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {allCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount input */}
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Số tiền chi / tháng
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="500000"
                  value={item.monthly_amount || ''}
                  onChange={(e) => handleAmountChange(idx, Number(e.target.value))}
                  className="w-full text-xs font-bold text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400 pointer-events-none">
                  {formatVND(item.monthly_amount)}
                </span>
              </div>
            </div>

            {/* Remove button */}
            <div className="sm:pt-5 flex justify-end">
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Xóa danh mục"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddItem}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Thêm danh mục chi tiêu
        </Button>

        <Button
          size="md"
          loading={saving}
          onClick={handleSave}
          icon={<Save className="w-3.5 h-3.5" />}
        >
          Lưu & Tối ưu hóa ví
        </Button>
      </div>
    </div>
  );
};
