import React from 'react';
import { RecommendationResponse } from '../../types/recommendation';
import { CreditCardVisual } from '../cards/CreditCardVisual';
import { formatVND, getBankFullName, localizeAlternativeTag } from '../../utils/formatters';
import { Button } from '../common/Button';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Check,
  Eye,
  RotateCcw,
  Tag,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

interface RecommendationResultViewProps {
  result: RecommendationResponse;
  contextAmount?: number | null;
  onReset: () => void;
  onViewDetailById: (cardId: string) => void;
  onToggleWalletById: (cardId: string) => void;
  walletCardIds: Set<string>;
  loadingWalletCardId?: string | null;
}

export const RecommendationResultView: React.FC<RecommendationResultViewProps> = ({
  result,
  contextAmount,
  onReset,
  onViewDetailById,
  onToggleWalletById,
  walletCardIds,
  loadingWalletCardId,
}) => {
  const { recommended_card, alternatives, mode } = result;
  const isRecommendedInWallet = walletCardIds.has(recommended_card.card_id);
  const bankDisplayName = getBankFullName(recommended_card.bank_name);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner: Contextual decision */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>
                {mode === 'USE_EXISTING_CARD'
                  ? 'Thẻ tối ưu nhất trong ví của bạn'
                  : 'Gợi ý mở thẻ phù hợp nhất cho bạn'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Nên quẹt thẻ <span className="text-teal-400">{recommended_card.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Khớp tối đa với khoản chi và khẩu vị thưởng của bạn mà không cần băn khoăn chọn lựa.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 self-start md:self-center shrink-0"
          >
            Tính khoản chi khác
          </Button>
        </div>
      </div>

      {/* Main Recommendation Spotlight */}
      <div className="bg-white rounded-3xl border-2 border-teal-500/40 shadow-lg p-6 sm:p-8 relative">
        <div className="absolute -top-3.5 left-8 bg-teal-600 text-white text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Khuyến nghị tối ưu nhất</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* Left: Card Visual */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <CreditCardVisual
              cardName={recommended_card.name}
              bankName={bankDisplayName}
              size="md"
              className="w-full max-w-xs shadow-xl"
            />
            <div className="mt-4 flex items-center gap-2 w-full max-w-xs">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onViewDetailById(recommended_card.card_id)}
                icon={<Eye className="w-3.5 h-3.5" />}
              >
                Xem chi tiết thẻ
              </Button>

              <Button
                variant={isRecommendedInWallet ? 'secondary' : 'primary'}
                size="sm"
                className="flex-1"
                loading={loadingWalletCardId === recommended_card.card_id}
                onClick={() => onToggleWalletById(recommended_card.card_id)}
                icon={
                  isRecommendedInWallet ? (
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )
                }
              >
                {isRecommendedInWallet ? 'Trong ví' : 'Thêm ví'}
              </Button>
            </div>
          </div>

          {/* Right: What You Gain, Why it fits, What to watch out */}
          <div className="lg:col-span-7 space-y-6">
            {/* What you gain (Estimated Benefit Box) */}
            <div className="p-5 rounded-2xl bg-teal-50/80 border border-teal-200/80 flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 block">
                  Bạn nhận được (What you gain)
                </span>
                <div className="text-2xl sm:text-3xl font-black text-teal-950 mt-1">
                  {recommended_card.estimated_value && recommended_card.estimated_value > 0
                    ? `+${formatVND(recommended_card.estimated_value)}`
                    : 'Quyền lợi tích lũy cao nhất'}
                </div>
                {contextAmount && recommended_card.estimated_value ? (
                  <p className="text-xs text-teal-700 mt-1 font-medium">
                    Tương đương nhận lại ~
                    {(
                      (recommended_card.estimated_value / contextAmount) *
                      100
                    ).toFixed(1)}
                    % trên hóa đơn {formatVND(contextAmount)}
                  </p>
                ) : (
                  <p className="text-xs text-teal-700 mt-1">
                    Theo cấu trúc hoàn thưởng tối ưu của {bankDisplayName}.
                  </p>
                )}
              </div>

              <div className="hidden sm:block text-right shrink-0">
                <span className="text-[11px] text-teal-700 block font-medium">Ngân hàng phát hành</span>
                <span className="font-bold text-slate-800 text-sm">
                  {bankDisplayName}
                </span>
              </div>
            </div>

            {/* Why This Card Fits (Reasons) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Vì sao thẻ này phù hợp với bạn (Why this card fits):</span>
              </h4>

              <div className="space-y-2">
                {recommended_card.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50/90 p-3 rounded-xl border border-slate-100 font-medium"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What you give up / Important conditions (Trade-offs) */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Điều cần lưu ý & Đánh đổi (What you give up):</span>
              </div>

              <div className="text-xs text-slate-600 space-y-1.5 pt-0.5">
                <p className="leading-relaxed">
                  • <strong>Hạn mức & Điều kiện sao kê:</strong> Kiểm tra mức chi tiêu tối thiểu trong kỳ hoặc hạn mức hoàn tiền tối đa theo tháng của ngân hàng.
                </p>
                <p className="leading-relaxed">
                  • <strong>Phí thường niên & Thu nhập:</strong> Nhấp vào <em>"Xem chi tiết thẻ"</em> bên cạnh để kiểm tra cụ thể biểu phí thường niên và điều kiện miễn phí hàng năm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alternatives Section */}
      {alternatives && alternatives.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Các lựa chọn thay thế đáng cân nhắc (Alternative options)
              </h3>
              <p className="text-xs text-slate-500">
                Nếu bạn cần tiêu chí khác như phí thường niên 0đ hoặc ưu đãi danh mục chuyên biệt
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
              {alternatives.length} phương án
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alternatives.map((alt) => {
              const inWallet = walletCardIds.has(alt.card_id);
              const altBankName = getBankFullName(alt.bank_name);
              const localizedBestFor = localizeAlternativeTag(alt.best_for);

              return (
                <div
                  key={alt.card_id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-slate-300 transition-all flex flex-col justify-between shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Lựa chọn #{alt.rank}
                      </span>
                      <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                        {localizedBestFor}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{alt.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{altBankName}</p>
                    </div>

                    <div className="pt-2">
                      <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="truncate font-medium">{localizedBestFor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onViewDetailById(alt.card_id)}
                    >
                      Chi tiết
                    </Button>
                    <Button
                      variant={inWallet ? 'secondary' : 'primary'}
                      size="sm"
                      className="flex-1"
                      loading={loadingWalletCardId === alt.card_id}
                      onClick={() => onToggleWalletById(alt.card_id)}
                      icon={
                        inWallet ? (
                          <Check className="w-3.5 h-3.5 text-teal-600" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )
                      }
                    >
                      {inWallet ? 'Trong ví' : 'Thêm ví'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
