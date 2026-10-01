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
    return <LoadingSpinner label="Để Cardy xem ví của bạn…" fullHeight />;
  }

  if (error) {
    return <ErrorNotice message={error} onRetry={fetchOptimization} />;
  }

  if (!data) return null;

  const hasCards = (data.category_recommendations && data.category_recommendations.length > 0) || !data.message;

  if (data.message && data.category_recommendations.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-line p-8 text-center space-y-4 shadow-card">
        <Zap className="w-10 h-10 text-blue-600 mx-auto" />
        <h3 className="text-base font-display font-extrabold text-ink">
          Cardy cần thêm chút thông tin chi tiêu để gợi ý
        </h3>
        <p className="text-xs text-ink-3 max-w-md mx-auto leading-relaxed">
          {data.message}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          {onGoToSpending && (
            <Button size="sm" onClick={onGoToSpending}>
              Điền mức chi hàng tháng
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
        <div className="bg-gradient-to-br from-ink to-blue-900 text-white rounded-3xl p-6 border border-ink-800 shadow-md">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-200 block">
            Ước tính hoàn tiền nhận được
          </span>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            {formatVND(data.total_annual_reward)}
            <span className="text-xs font-normal text-slate-300"> / năm</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-2">
            Khi bạn quẹt đúng chiếc card được gợi ý cho từng khoản chi.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-line shadow-card flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-3 block">
              Mức chi hàng tháng của bạn
            </span>
            <div className="text-2xl font-display font-extrabold text-ink mt-1">
              {formatVND(data.total_monthly_spending)}
            </div>
          </div>
          <p className="text-[11px] text-ink-3 mt-2">
            Được ước tính theo mức chi bạn đã điền.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-line shadow-card flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-3 block">
              Độ phủ ưu đãi của ví
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-display font-bold text-ink">
                {data.category_recommendations.length - data.weak_categories.length} /{' '}
                {data.category_recommendations.length} nhóm
              </span>
              {data.weak_categories.length === 0 ? (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Đủ thẻ cho mọi nhóm
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Thiếu ưu đãi ở {data.weak_categories.length} nhóm
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
                icon={<Sparkles className="w-3.5 h-3.5 text-blue-200" />}
                className="text-xs"
              >
                So thử card mới
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Category -> Card Mapping Guide */}
      <div className="bg-white rounded-3xl border border-line shadow-card p-6 sm:p-8">
        <div className="mb-6 pb-4 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-display font-extrabold text-ink tracking-tight flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>Đi đâu, quẹt card gì?</span>
            </h3>
            <p className="text-xs text-ink-3 mt-0.5">
              Chi tiêu nhóm nào, cứ rút chiếc card này ra quẹt:
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {data.category_recommendations.map((rec) => {
            return (
              <div
                key={rec.category}
                className="p-4 sm:p-5 rounded-2xl border border-line bg-paper hover:bg-white hover:border-blue-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Category & Spending */}
                <div className="md:w-1/4">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-3 block">
                    Khoản chi
                  </span>
                  <span className="text-base font-display font-extrabold text-ink block mt-0.5">
                    {rec.category}
                  </span>
                  <span className="text-xs text-ink-3 font-medium">
                    Chi {formatVND(rec.monthly_spending)} / tháng
                  </span>
                </div>

                <div className="hidden md:flex items-center text-slate-300">
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* Recommended Card */}
                <div className="md:w-1/3">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
                    Quẹt card này
                  </span>
                  <button
                    onClick={() => onViewCardDetailById(rec.recommended_card_id)}
                    className="text-left group inline-block"
                  >
                    <span className="text-sm font-bold text-ink group-hover:text-blue-600 transition-colors block">
                      {rec.recommended_card_name}
                    </span>
                    <span className="text-[11px] text-ink-3 block line-clamp-1 mt-0.5">
                      {rec.reason}
                    </span>
                  </button>
                </div>

                {/* Expected Return */}
                <div className="md:text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-3 block">
                    Hoàn tiền ước tính
                  </span>
                  <span className="text-sm font-extrabold text-emerald-600 block mt-0.5">
                    +{formatVND(rec.expected_annual_reward)}
                    <span className="text-[10px] text-ink-3 font-normal"> / năm</span>
                  </span>
                  <span className="text-[10px] text-ink-3 block">
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
              <h4 className="text-base font-display font-extrabold text-amber-950">
                Mục chi tiêu chưa có ưu đãi tốt ({data.weak_categories.length} nhóm)
              </h4>
              <p className="text-xs text-amber-800/90 mt-0.5">
                Các nhóm này bạn chi tiêu khá nhiều nhưng ví hiện tại chưa có card hoàn tiền hay tích điểm tốt (&lt; 1%).
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
                  <span className="font-bold text-xs text-ink">{w.category}</span>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Chưa có card tốt
                  </span>
                </div>
                <div className="mt-2 text-xs text-ink-3">
                  <span>Chi tiêu: </span>
                  <span className="font-bold text-ink">{formatVND(w.monthly_amount)}/th</span>
                </div>
                <p className="text-[11px] text-ink-3 mt-1 italic">
                  {w.reason}
                </p>
              </div>
            ))}
          </div>

          {onGoToSimulation && (
            <div className="mt-5 pt-4 border-t border-amber-200/60 flex items-center justify-between">
              <p className="text-xs text-amber-900 font-medium">
                Đang tính mở thêm thẻ? So thử xem card nào bù đúng chỗ thiếu này nhé.
              </p>
              <Button
                size="sm"
                onClick={onGoToSimulation}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                className="bg-amber-700 hover:bg-amber-800 text-white"
              >
                So thử card mới bù thiếu
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
