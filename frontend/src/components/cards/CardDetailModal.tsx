import React, { useEffect, useState } from 'react';
import { CardOut, CardDetailOut } from '../../types/card';
import { getCardDetail } from '../../api/cards';
import { calculateReward } from '../../api/rewards';
import { RewardCalcResponse } from '../../types/rewards';
import { Modal } from '../common/Modal';
import { CreditCardVisual } from './CreditCardVisual';
import { formatVND, formatBenefit, getTierBadgeStyle, getBankFullName } from '../../utils/formatters';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorNotice } from '../common/ErrorNotice';
import { Button } from '../common/Button';
import {
  Tag,
  Building2,
  ExternalLink,
  ShieldCheck,
  Gift,
  Plus,
  Check,
  Calculator,
  Coins,
} from 'lucide-react';

interface CardDetailModalProps {
  card: CardOut | null;
  isOpen: boolean;
  onClose: () => void;
  isInWallet?: boolean;
  onToggleWallet?: (card: CardOut) => void;
  loadingWallet?: boolean;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  isOpen,
  onClose,
  isInWallet = false,
  onToggleWallet,
  loadingWallet = false,
}) => {
  const [detail, setDetail] = useState<CardDetailOut | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live calculator inside modal
  const [calcAmount, setCalcAmount] = useState<number>(2000000);
  const [calcCategory, setCalcCategory] = useState<string>('Online');
  const [calcMerchant, setCalcMerchant] = useState<string>('');
  const [calcLoading, setCalcLoading] = useState<boolean>(false);
  const [calcResult, setCalcResult] = useState<RewardCalcResponse | null>(null);

  useEffect(() => {
    if (!isOpen || !card) {
      setDetail(null);
      setError(null);
      setCalcResult(null);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCardDetail(card.card_id);
        setDetail(data);
        if (data.benefits && data.benefits.length > 0) {
          setCalcCategory(data.benefits[0].category);
        }
      } catch (err: any) {
        setError(err.message || 'Không thể tải chi tiết thẻ.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [isOpen, card]);

  const handleCalculateReward = async () => {
    if (!card) return;
    setCalcLoading(true);
    try {
      const res = await calculateReward({
        card_id: card.card_id,
        amount: calcAmount,
        category: calcCategory || undefined,
        merchant_id: calcMerchant || undefined,
      });
      setCalcResult(res);
    } catch (err) {
      console.error('Failed to calculate reward:', err);
    } finally {
      setCalcLoading(false);
    }
  };

  if (!card) return null;

  const tierStyle = getTierBadgeStyle(card.card_tier);
  const bankFull = getBankFullName(detail?.bank?.name || card.bank_id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={card.name}
      subtitle={`Thẻ tín dụng ${bankFull} • ${card.network || 'Visa'} • ${card.card_tier || 'Classic'}`}
      maxWidth="2xl"
    >
      {loading ? (
        <LoadingSpinner label="Để Cardy xem chi tiết quyền lợi thẻ..." fullHeight />
      ) : error ? (
        <ErrorNotice
          message={error}
          onRetry={() => {
            if (card) {
              setLoading(true);
              getCardDetail(card.card_id)
                .then(setDetail)
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false));
            }
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Card Visual & Top overview */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-paper border border-line">
            <CreditCardVisual
              cardName={card.name}
              bankId={card.bank_id}
              bankName={bankFull}
              network={card.network}
              cardTier={card.card_tier}
              annualFee={card.annual_fee}
              size="sm"
              className="shadow-card"
            />

            <div className="flex-1 space-y-3 w-full">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                  {bankFull}
                </span>
                {card.card_tier && (
                  <span
                    className={`text-xs font-bold uppercase px-2.5 py-1 rounded-lg border ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}
                  >
                    {card.card_tier}
                  </span>
                )}
                {card.network && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-paper text-ink-2 border border-line">
                    {card.network}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-ink-3 block font-bold uppercase text-[10px]">Phí thường niên:</span>
                  <span className="font-bold text-navy-900 text-sm mt-0.5 block">
                    {card.annual_fee === 0 ? '0đ phí năm' : formatVND(card.annual_fee)}
                  </span>
                </div>
                <div>
                  <span className="text-ink-3 block font-bold uppercase text-[10px]">Yêu cầu thu nhập:</span>
                  <span className="font-bold text-navy-900 text-sm mt-0.5 block">
                    {card.minimum_income && card.minimum_income > 0
                      ? `${formatVND(card.minimum_income)}/tháng`
                      : 'Không yêu cầu'}
                  </span>
                </div>
              </div>

              {card.annual_fee_waiver_condition && (
                <div className="flex items-start gap-1.5 text-xs text-ink-2 bg-[#fff1cc]/60 p-2.5 rounded-xl border border-[#ffc93c]/50">
                  <ShieldCheck className="w-4 h-4 text-[#9a5f00] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-navy-900">Điều kiện miễn phí:</strong>{' '}
                    {card.annual_fee_waiver_condition}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Live Reward Calculator */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>Thử tính hoàn tiền khi quẹt thẻ này</span>
              </span>
              <span className="text-[10px] text-blue-700 font-bold bg-white px-2 py-0.5 rounded-md border border-blue-200">
                Tính nhanh
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-ink-3 uppercase block mb-1">
                  Số tiền quẹt (₫)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100000"
                  value={calcAmount || ''}
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-full text-xs font-bold text-navy-900 bg-white px-3 py-2 rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="2000000"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-ink-3 uppercase block mb-1">
                  Danh mục chi tiêu
                </label>
                <select
                  value={calcCategory}
                  onChange={(e) => setCalcCategory(e.target.value)}
                  className="w-full text-xs font-bold text-navy-900 bg-white px-3 py-2 rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Online">Online / Mua sắm</option>
                  <option value="Dining">Dining / Ăn uống</option>
                  <option value="Supermarket">Supermarket / Siêu thị</option>
                  <option value="Travel">Travel / Du lịch</option>
                  <option value="General">Chi tiêu chung</option>
                </select>
              </div>

              <div className="sm:pt-5">
                <Button
                  size="sm"
                  loading={calcLoading}
                  onClick={handleCalculateReward}
                  icon={<Coins className="w-3.5 h-3.5" />}
                  className="w-full font-bold"
                >
                  Tính tiền hoàn
                </Button>
              </div>
            </div>

            {calcResult && (
              <div className="mt-2 p-3.5 bg-white rounded-xl border border-blue-200 flex items-center justify-between gap-3 animate-fadeIn">
                <div>
                  <span className="text-[10px] text-ink-3 block uppercase font-bold">
                    Tiền nhận lại ước tính:
                  </span>
                  <div className="text-lg font-black text-navy-900">
                    +{formatVND(calcResult.estimated_reward_value)}
                  </div>
                  {calcResult.conditions_note && (
                    <p className="text-[10px] text-ink-3 mt-0.5">{calcResult.conditions_note}</p>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-success bg-[#dcf5ea] px-2.5 py-1 rounded-lg border border-[#2fbf8f]/40">
                    {((calcResult.estimated_reward_value / (calcAmount || 1)) * 100).toFixed(1)}% hoàn
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Category Benefits Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-navy-900">
                Ưu đãi theo danh mục chi tiêu ({detail?.benefits?.length || 0})
              </h4>
            </div>

            {detail?.benefits && detail.benefits.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {detail.benefits.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-2xl border border-line bg-white hover:border-blue-300 transition-colors shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs text-navy-900">{b.category}</span>
                      <span className="font-extrabold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        {formatBenefit(b.benefit_value, b.benefit_unit, b.benefit_type)}
                      </span>
                    </div>

                    {(b.maximum_benefit || b.minimum_spend || b.conditions) && (
                      <div className="mt-2 pt-2 border-t border-line space-y-1 text-[11px] text-ink-2">
                        {b.maximum_benefit && (
                          <div className="flex items-center justify-between">
                            <span>Giới hạn tối đa:</span>
                            <span className="font-bold text-navy-900">
                              {formatVND(b.maximum_benefit)}/{b.frequency || 'tháng'}
                            </span>
                          </div>
                        )}
                        {b.minimum_spend && b.minimum_spend > 0 && (
                          <div className="flex items-center justify-between">
                            <span>Chi tiêu tối thiểu:</span>
                            <span className="font-bold text-navy-900">
                              {formatVND(b.minimum_spend)}
                            </span>
                          </div>
                        )}
                        {b.conditions && (
                          <p className="text-[10px] text-ink-3 italic mt-1 line-clamp-2">
                            * {b.conditions}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-paper text-center text-xs text-ink-3 border border-line">
                Áp dụng chương trình tích lũy chuẩn theo biểu phí ngân hàng.
              </div>
            )}
          </div>

          {/* Merchant Deals Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-4 h-4 text-sun" />
              <h4 className="text-sm font-bold text-navy-900">
                Ưu đãi quán quen & Đối tác độc quyền ({detail?.merchants?.length || 0})
              </h4>
            </div>

            {detail?.merchants && detail.merchants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {detail.merchants.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-2xl border border-line bg-white hover:border-sun transition-colors shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-ink-3" />
                        <span className="font-bold text-xs text-navy-900">
                          {m.merchant_name || m.merchant_id}
                        </span>
                      </div>
                      <span className="font-extrabold text-xs text-[#9a5f00] bg-[#fff1cc] px-2 py-0.5 rounded-md border border-[#ffc93c]/50">
                        {formatBenefit(m.benefit_value, m.benefit_unit, m.benefit_type)}
                      </span>
                    </div>

                    {m.conditions && (
                      <p className="mt-2 text-[11px] text-ink-2 leading-normal">
                        {m.conditions}
                      </p>
                    )}
                    {m.maximum_benefit && (
                      <p className="mt-1 text-[10px] text-ink-3">
                        Giảm tối đa: {formatVND(m.maximum_benefit)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-paper text-center text-xs text-ink-3 border border-line">
                Áp dụng chương trình ưu đãi tích hợp chung của tổ chức thẻ.
              </div>
            )}
          </div>

          {/* Bank & External Application */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-line">
            {detail?.bank?.website ? (
              <a
                href={detail.bank.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 font-bold"
              >
                <span>Xem trang chủ {bankFull}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="text-xs text-ink-3">Ngân hàng phát hành: {bankFull}</span>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onToggleWallet && (
                <Button
                  variant={isInWallet ? 'secondary' : 'primary'}
                  size="md"
                  loading={loadingWallet}
                  onClick={() => onToggleWallet(card)}
                  icon={
                    isInWallet ? (
                      <Check className="w-4 h-4 text-success stroke-[3]" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )
                  }
                  className="w-full sm:w-auto font-bold"
                >
                  {isInWallet ? 'Đã có trong ví của bạn' : 'Lưu card vào ví'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
