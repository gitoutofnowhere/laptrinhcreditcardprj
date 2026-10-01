import React, { useState, useEffect } from 'react';
import { WalletOptimizationResult } from '../../types/wallet';
import { optimizeWallet } from '../../api/wallet';
import { formatVND } from '../../utils/formatters';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorNotice } from '../common/ErrorNotice';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  CreditCard,
  Zap,
} from 'lucide-react';

interface WalletOptimizerViewProps {
  onGoToSimulation?: () => void;
  onGoToSpending?: () => void;
  onViewCardDetailById: (cardId: string) => void;
}

export const WalletOptimizerView: React.FC<WalletOptimizerViewProps> = ({
  onGoToSimulation,
  onGoToSpending,
  onViewCardDetailById,
}) => {
  const [data, setData] = useState<WalletOptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOptimization = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await optimizeWallet();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Không thể tối ưu hóa ví.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptimization();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Đang phân tích và tối ưu hóa ví của bạn..." fullHeight />;
  }

  if (error) {
    return <ErrorNotice message={error} onRetry={fetchOptimization} />;
  }

  if (!data) return null;

  const hasCards = (data.category_recommendations && data.category_recommendations.length > 0) || !data.message;

  if (data.message && data.category_recommendations.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4">
        <Zap className="w-10 h-10 text-teal-600 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">
          Chưa đủ dữ liệu để chạy thuật toán tối ưu hóa
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          {data.message}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          {onGoToSpending && (
            <Button size="sm" onClick={onGoToSpending}>
              Cập nhật hồ sơ chi tiêu
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={fetchOptimization} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 border border-slate-800 shadow-md">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-300 block">
            Lợi ích hoàn thưởng ước tính
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            {formatVND(data.total_annual_reward)}
            <span className="text-xs font-normal text-slate-300"> / năm</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Khi bạn sử dụng đúng thẻ được đề xuất cho từng khoản chi.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Tổng chi tiêu hàng tháng
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatVND(data.total_monthly_spending)}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Được cấu hình trong hồ sơ chi tiêu cá nhân của bạn.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Tình trạng bao phủ quyền lợi
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold text-slate-900">
                {data.category_recommendations.length - data.weak_categories.length} /{' '}
                {data.category_recommendations.length} nhóm
              </span>
              {data.weak_categories.length === 0 ? (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Tối ưu 100%
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Cần bổ sung {data.weak_categories.length} nhóm
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchOptimization}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Cập nhật lại
            </Button>
            {onGoToSimulation && (
              <Button
                size="sm"
                onClick={onGoToSimulation}
                icon={<Sparkles className="w-3.5 h-3.5 text-teal-400" />}
                className="text-xs"
              >
                Mô phỏng thêm thẻ
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Category -> Card Mapping Guide */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="mb-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-teal-600" />
              <span>Bản đồ quẹt thẻ thông minh theo danh mục</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Để tối đa hóa quyền lợi, hãy dùng đúng chiếc thẻ tương ứng khi thanh toán:
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {data.category_recommendations.map((rec) => {
            const isWeak = data.weak_categories.some((w) => w.category === rec.category);

            return (
              <div
                key={rec.category}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Category & Spending */}
                <div className="md:w-1/4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Danh mục
                  </span>
                  <span className="text-base font-extrabold text-slate-900 block mt-0.5">
                    {rec.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Chi {formatVND(rec.monthly_spending)} / tháng
                  </span>
                </div>

                <div className="hidden md:flex items-center text-slate-300">
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* Recommended Card */}
                <div className="md:w-1/3">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
                    Nên quẹt thẻ
                  </span>
                  <button
                    onClick={() => onViewCardDetailById(rec.recommended_card_id)}
                    className="text-left group inline-block"
                  >
                    <span className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors block">
                      {rec.recommended_card_name}
                    </span>
                    <span className="text-[11px] text-slate-400 block line-clamp-1 mt-0.5">
                      {rec.reason}
                    </span>
                  </button>
                </div>

                {/* Expected Return */}
                <div className="md:text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Hoàn thưởng dự kiến
                  </span>
                  <span className="text-sm font-black text-emerald-600 block mt-0.5">
                    +{formatVND(rec.expected_annual_reward)}
                    <span className="text-[10px] text-slate-400 font-normal"> / năm</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    (~{formatVND(rec.expected_monthly_reward)}/tháng)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak Categories / Category Gaps */}
      {data.weak_categories && data.weak_categories.length > 0 && (
        <div className="bg-amber-50/70 rounded-3xl border border-amber-200/80 p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-amber-950">
                Danh mục chi tiêu chưa có thẻ mạnh ({data.weak_categories.length} nhóm)
              </h4>
              <p className="text-xs text-amber-800/90 mt-0.5">
                Các danh mục này bạn có chi tiêu đáng kể nhưng ví thẻ hiện tại chưa có chương trình
                hoàn tiền hoặc tích điểm cao (&lt; 1%).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {data.weak_categories.map((w) => (
              <div
                key={w.category}
                className="p-4 rounded-2xl bg-white border border-amber-200/70 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{w.category}</span>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Khoảng trống
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  <span>Chi tiêu: </span>
                  <span className="font-bold text-slate-800">{formatVND(w.monthly_amount)}/th</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  {w.reason}
                </p>
              </div>
            ))}
          </div>

          {onGoToSimulation && (
            <div className="mt-5 pt-4 border-t border-amber-200/60 flex items-center justify-between">
              <p className="text-xs text-amber-900 font-medium">
                Khắc phục khoảng trống này bằng cách thử mở thêm một chiếc thẻ tối ưu.
              </p>
              <Button
                size="sm"
                onClick={onGoToSimulation}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                className="bg-amber-700 hover:bg-amber-800 text-white"
              >
                Mô phỏng thẻ giải quyết khoảng trống
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
