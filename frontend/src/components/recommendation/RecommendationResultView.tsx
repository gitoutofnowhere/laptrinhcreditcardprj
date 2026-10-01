import React from 'react';
import { RecommendationResponse } from '../../types/recommendation';
import { CreditCardVisual } from '../cards/CreditCardVisual';
import { formatVND, getBankFullName, localizeAlternativeTag } from '../../utils/formatters';
import { Button } from '../common/Button';
import {
  Sparkles,
  CheckCircle2,
  Plus,
  Check,
  Eye,
  RotateCcw,
  Tag,
  ShieldAlert,
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
      <div className="bg-navy-900 rounded-3xl p-6 sm:p-8 text-white shadow-lift relative overflow-hidden border border-navy-950">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-sun" />
              <span>
                {mode === 'USE_EXISTING_CARD'
                  ? 'Card tốt nhất trong ví của bạn'
                  : 'Cardy tìm được vài chiếc hợp gu rồi.'}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
              Nên quẹt thẻ <span className="text-sun">{recommended_card.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
              Thẻ này hợp bạn đấy! Khớp tối đa với khoản chi và ưu đãi bạn cần mà không phải băn khoăn.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 self-start md:self-center shrink-0 font-bold"
          >
            Tính khoản chi khác
          </Button>
        </div>
      </div>

      {/* Main Recommendation Spotlight */}
      <div className="bg-white rounded-3xl border-2 border-blue-600 shadow-lift p-6 sm:p-8 relative">
        <div className="absolute -top-3.5 left-8 bg-blue-600 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-press flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-sun" />
          <span>★ Phù hợp nhất</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* Left: Card Visual */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <CreditCardVisual
              cardName={recommended_card.name}
              bankName={bankDisplayName}
              size="md"
              className="w-full max-w-xs shadow-lift"
            />
            <div className="mt-4 flex items-center gap-2 w-full max-w-xs">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 font-bold"
                onClick={() => onViewDetailById(recommended_card.card_id)}
                icon={<Eye className="w-3.5 h-3.5" />}
              >
                Xem card
              </Button>

              <Button
                variant={isRecommendedInWallet ? 'secondary' : 'primary'}
                size="sm"
                className="flex-1 font-bold"
                loading={loadingWalletCardId === recommended_card.card_id}
                onClick={() => onToggleWalletById(recommended_card.card_id)}
                icon={
                  isRecommendedInWallet ? (
                    <Check className="w-3.5 h-3.5 text-success stroke-[3]" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )
                }
              >
                {isRecommendedInWallet ? 'Trong ví' : 'Lưu card'}
              </Button>
            </div>
          </div>

          {/* Right: What You Gain, Why it fits, What to watch out */}
          <div className="lg:col-span-7 space-y-6">
            {/* What you gain (Estimated Benefit Box) */}
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                  Bạn nhận được ước tính:
                </span>
                <div className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
                  {recommended_card.estimated_value && recommended_card.estimated_value > 0
                    ? `+${formatVND(recommended_card.estimated_value)}`
                    : 'Quyền lợi tích lũy cao nhất'}
                </div>
                {contextAmount && recommended_card.estimated_value ? (
                  <p className="text-xs text-blue-700 mt-1 font-semibold">
                    Tương đương nhận lại ~
                    {(
                      (recommended_card.estimated_value / contextAmount) *
                      100
                    ).toFixed(1)}
                    % trên hóa đơn {formatVND(contextAmount)}
                  </p>
                ) : (
                  <p className="text-xs text-blue-700 mt-1 font-medium">
                    Theo cấu trúc hoàn thưởng tối ưu của {bankDisplayName}.
                  </p>
                )}
              </div>

              <div className="hidden sm:block text-right shrink-0">
                <span className="text-[11px] text-ink-3 block font-medium">Ngân hàng phát hành</span>
                <span className="font-bold text-navy-900 text-sm">
                  {bankDisplayName}
                </span>
              </div>
            </div>

            {/* Why This Card Fits (Reasons) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Ưu đãi tại cửa hàng yêu thích & Điểm cộng:</span>
              </h4>

              <div className="space-y-2">
                {recommended_card.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-navy-900 bg-paper p-3 rounded-xl border border-line font-medium"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Honest Notes / Trade-offs */}
            <div className="p-4 rounded-2xl bg-[#fff1cc]/60 border border-[#ffc93c]/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#9a5f00]">
                <ShieldAlert className="w-4 h-4 text-[#9a5f00] shrink-0" />
                <span>Lưu ý một chút:</span>
              </div>

              <div className="text-xs text-ink-2 space-y-1.5 pt-0.5 font-medium">
                <p className="leading-relaxed">
                  • <strong>Hạn mức & Kỳ sao kê:</strong> Kiểm tra mức chi tiêu tối thiểu trong kỳ hoặc hạn mức hoàn tiền tối đa theo tháng của ngân hàng.
                </p>
                <p className="leading-relaxed">
                  • <strong>Phí thường niên:</strong> Phí thường niên có thể phát sinh nếu không đạt điều kiện miễn phí — nhưng benefit hoàn tiền thường bù đắp rất tốt nếu chi tiêu đúng ngành.
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
              <h3 className="font-display text-lg font-black text-navy-900 tracking-tight">
                Đang phân vân? Xem thêm mấy chiếc này:
              </h3>
              <p className="text-xs text-ink-2">
                Các lựa chọn khác cũng rất đáng cân nhắc nếu bạn quan tâm tiêu chí khác
              </p>
            </div>
            <span className="text-xs font-bold text-ink-3 bg-paper px-2.5 py-1 rounded-lg border border-line">
              {alternatives.length} gợi ý
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
                  className="bg-white rounded-2xl border border-line p-5 hover:border-blue-300 transition-all flex flex-col justify-between shadow-card hover:shadow-lift"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-3">
                        Gợi ý #{alt.rank}
                      </span>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        {localizedBestFor}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-navy-900 text-sm line-clamp-1">{alt.name}</h4>
                      <p className="text-xs text-ink-3 mt-0.5">{altBankName}</p>
                    </div>

                    <div className="pt-2">
                      <div className="text-[11px] text-ink-2 bg-paper p-2.5 rounded-xl border border-line flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate font-semibold">{localizedBestFor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-line flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 font-bold"
                      onClick={() => onViewDetailById(alt.card_id)}
                    >
                      Chi tiết
                    </Button>
                    <Button
                      variant={inWallet ? 'secondary' : 'primary'}
                      size="sm"
                      className="flex-1 font-bold"
                      loading={loadingWalletCardId === alt.card_id}
                      onClick={() => onToggleWalletById(alt.card_id)}
                      icon={
                        inWallet ? (
                          <Check className="w-3.5 h-3.5 text-success stroke-[3]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )
                      }
                    >
                      {inWallet ? 'Trong ví' : 'Lưu card'}
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
