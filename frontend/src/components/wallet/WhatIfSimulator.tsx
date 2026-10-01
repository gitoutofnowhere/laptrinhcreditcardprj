import React, { useState, useEffect } from 'react';
import { CardOut } from '../../types/card';
import { SimulationResponse } from '../../types/simulation';
import { getCards } from '../../api/cards';
import { simulateNewCard } from '../../api/simulation';
import { formatVND, getBankFullName } from '../../utils/formatters';
import { CreditCardVisual } from '../cards/CreditCardVisual';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorNotice } from '../common/ErrorNotice';
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Check,
  Search,
  Zap,
} from 'lucide-react';

interface WhatIfSimulatorProps {
  ownedCardIds: Set<string>;
  onAddCardToWallet: (cardId: string) => Promise<void>;
  onViewCardDetailById: (cardId: string) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  ownedCardIds,
  onAddCardToWallet,
  onViewCardDetailById,
}) => {
  const [candidateCards, setCandidateCards] = useState<CardOut[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [loadingCards, setLoadingCards] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [addingToWallet, setAddingToWallet] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoadingCards(true);
      try {
        const all = await getCards();
        // Candidates are cards not currently in wallet
        const notInWallet = all.filter((c) => !ownedCardIds.has(c.card_id));
        setCandidateCards(notInWallet);
        if (notInWallet.length > 0 && !selectedCardId) {
          setSelectedCardId(notInWallet[0].card_id);
        }
      } catch (err) {
        console.error('Failed to load candidate cards:', err);
      } finally {
        setLoadingCards(false);
      }
    };
    fetchCandidates();
  }, [ownedCardIds]);

  const handleSimulate = async (cardIdToSimulate: string) => {
    if (!cardIdToSimulate) return;
    setSimulating(true);
    setError(null);
    setAddedSuccess(false);
    try {
      const res = await simulateNewCard(cardIdToSimulate);
      setSimResult(res);
    } catch (err: any) {
      setError(
        err.message ||
          'Chưa tính được. Bạn nhớ điền mức chi hàng tháng trước nhé.'
      );
    } finally {
      setSimulating(false);
    }
  };

  const selectedCard = candidateCards.find((c) => c.card_id === selectedCardId);

  const filteredCandidates = candidateCards.filter((c) => {
    const q = search.toLowerCase();
    const bankFull = getBankFullName(c.bank_id).toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.bank_id.toLowerCase().includes(q) ||
      bankFull.includes(q) ||
      (c.network && c.network.toLowerCase().includes(q))
    );
  });

  const handleAddSimulatedCard = async () => {
    if (!simResult) return;
    setAddingToWallet(true);
    try {
      await onAddCardToWallet(simResult.new_card_id);
      setAddedSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Lỗi thêm thẻ vào ví.');
    } finally {
      setAddingToWallet(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-ink via-blue-950 to-ink rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-ink-800">
        <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Đang phân vân thẻ mới?</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white mt-1">
          &ldquo;Có nên mở thêm chiếc card này không?&rdquo;
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
          Đừng mở card đại! Chọn thử một chiếc card để so:{' '}
          <strong className="text-white">Ví hiện tại</strong> vs{' '}
          <strong className="text-sun">Ví sau khi thêm card mới</strong>.
        </p>
      </div>

      {error && <ErrorNotice message={error} className="mb-4" />}

      {/* Candidate Card Picker */}
      <div className="bg-white rounded-3xl border border-line shadow-card p-6 sm:p-8">
        <h3 className="text-base font-display font-extrabold text-ink tracking-tight mb-2">
          1. Chọn card bạn đang tính mở
        </h3>
        <p className="text-xs text-ink-3 mb-4">
          Các dòng card bạn chưa có trong ví:
        </p>

        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên thẻ hoặc ngân hàng (VD: StepUp, Spark, Shopee, VCB, Techcombank)..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
          />
        </div>

        {loadingCards ? (
          <LoadingSpinner label="Để Cardy tìm danh sách card…" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
            {filteredCandidates.map((c) => {
              const isSelected = selectedCardId === c.card_id;
              const bankName = getBankFullName(c.bank_id);
              return (
                <button
                  key={c.card_id}
                  type="button"
                  onClick={() => {
                    setSelectedCardId(c.card_id);
                    handleSimulate(c.card_id);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-line hover:border-blue-200 bg-paper hover:bg-white text-ink'
                  }`}
                >
                  <div className="truncate">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider block ${
                        isSelected ? 'text-blue-100' : 'text-blue-600'
                      }`}
                    >
                      {bankName}
                    </span>
                    <span className="text-xs font-bold truncate block">{c.name}</span>
                    <span
                      className={`text-[11px] block ${
                        isSelected ? 'text-blue-100' : 'text-ink-3'
                      }`}
                    >
                      Phí: {c.annual_fee === 0 ? '0 ₫' : formatVND(c.annual_fee)}
                    </span>
                  </div>
                  {isSelected && <Zap className="w-4 h-4 text-sun shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-line flex items-center justify-between">
          <span className="text-xs text-ink-3 font-medium">
            Đang chọn:{' '}
            <strong className="text-ink">
              {selectedCard ? selectedCard.name : 'Chưa chọn'}
            </strong>
          </span>

          <Button
            size="md"
            loading={simulating}
            disabled={!selectedCardId}
            onClick={() => handleSimulate(selectedCardId)}
            icon={<Sparkles className="w-4 h-4 text-sun" />}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            So thử card này
          </Button>
        </div>
      </div>

      {/* Simulation Results View */}
      {simResult && (
        <div className="bg-white rounded-3xl border border-line shadow-card p-6 sm:p-8 space-y-6 animate-slideUp">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Kết quả so sánh
              </span>
              <h3 className="text-xl font-display font-extrabold text-ink mt-0.5">
                Nếu mở thêm {simResult.new_card_name}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={addedSuccess ? 'secondary' : 'primary'}
                size="sm"
                loading={addingToWallet}
                onClick={handleAddSimulatedCard}
                icon={addedSuccess ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Plus className="w-3.5 h-3.5" />}
              >
                {addedSuccess ? 'Đã có trong ví' : 'Lưu card này vào ví'}
              </Button>
            </div>
          </div>

          {/* Comparison Cards: CURRENT WALLET vs CURRENT + NEW CARD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Box 1: Current Wallet */}
            <div className="bg-paper rounded-2xl p-5 border border-line space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-3 block">
                Ví hiện tại của bạn
              </span>
              <div className="text-xl sm:text-2xl font-display font-extrabold text-ink">
                {formatVND(simResult.current_estimated_annual_reward)}
                <span className="text-xs font-normal text-ink-3"> / năm</span>
              </div>
              <p className="text-[11px] text-ink-3">
                Tổng lợi ích hoàn thưởng ước tính mỗi năm từ các thẻ bạn đang có.
              </p>
            </div>

            {/* Box 2: Current + New Card */}
            <div className="bg-blue-50/70 rounded-2xl p-5 border border-blue-200/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800 block">
                Ví sau khi thêm card này
              </span>
              <div className="text-xl sm:text-2xl font-display font-extrabold text-blue-950">
                {formatVND(simResult.simulated_estimated_annual_reward)}
                <span className="text-xs font-normal text-blue-700"> / năm</span>
              </div>
              <p className="text-[11px] text-blue-700">
                Lợi ích tối ưu kết hợp cùng thẻ {simResult.new_card_name}.
              </p>
            </div>

            {/* Box 3: Delta Difference */}
            <div
              className={`rounded-2xl p-5 border space-y-2 ${
                simResult.annual_difference > 0
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-paper border-line text-ink-2'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                Hoàn tiền tăng thêm
              </span>
              <div className="text-2xl font-display font-extrabold">
                {simResult.annual_difference > 0 ? '+' : ''}
                {formatVND(simResult.annual_difference)}
                <span className="text-xs font-normal opacity-70"> / năm</span>
              </div>
              <p className="text-[11px] opacity-80">
                {simResult.annual_difference > 0
                  ? 'Mở thêm chiếc này lời hơn hẳn!'
                  : 'Chiếc card này không tăng thêm hoàn tiền so với các card bạn đang có.'}
              </p>
            </div>
          </div>

          {/* Improved Categories Table */}
          <div className="pt-2">
            <h4 className="text-sm font-display font-bold text-ink mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>
                Các nhóm chi tiêu được hoàn tiền nhiều hơn ({simResult.improved_categories.length})
              </span>
            </h4>

            {simResult.improved_categories.length > 0 ? (
              <div className="border border-line rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-paper border-b border-line text-ink-3 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5 pl-4">Khoản chi</th>
                        <th className="p-3.5">Card hiện tại</th>
                        <th className="p-3.5">Đổi sang card này</th>
                        <th className="p-3.5 text-right">Hoàn tiền cũ / năm</th>
                        <th className="p-3.5 text-right">Hoàn tiền mới / năm</th>
                        <th className="p-3.5 pr-4 text-right">Tăng thêm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line font-medium">
                      {simResult.improved_categories.map((imp, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                          <td className="p-3.5 pl-4 font-bold text-ink">{imp.category}</td>
                          <td className="p-3.5 text-ink-3">
                            {imp.previous_card || 'Chưa có card mạnh'}
                          </td>
                          <td className="p-3.5 text-blue-700 font-bold">{imp.new_card}</td>
                          <td className="p-3.5 text-right text-ink-3">
                            {formatVND(imp.previous_annual_reward)}
                          </td>
                          <td className="p-3.5 text-right font-bold text-ink">
                            {formatVND(imp.new_annual_reward)}
                          </td>
                          <td className="p-3.5 pr-4 text-right font-black text-emerald-600">
                            +{formatVND(imp.annual_gain)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-paper border border-line text-center text-xs text-ink-3 space-y-1">
                <p className="font-semibold text-ink">
                  Không có nhóm nào tăng thêm hoàn tiền.
                </p>
                <p className="text-[11px] text-ink-3">
                  Ví của bạn hiện tại đã đủ tốt rồi, hoặc chiếc card này trùng ưu đãi với các card bạn đang có.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
