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
          'Không thể mô phỏng. Vui lòng đảm bảo bạn đã nhập hồ sơ chi tiêu hàng tháng trước khi mô phỏng.'
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
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-slate-800">
        <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mô phỏng ví thông minh</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
          &ldquo;Nếu mở thêm một chiếc thẻ nữa, ví của tôi có thực sự tốt hơn không?&rdquo;
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
          Đừng mở thẻ bừa bãi. Chọn một chiếc thẻ ứng viên để đối chiếu trực tiếp giữa:{' '}
          <strong className="text-white">Ví hiện tại</strong> và{' '}
          <strong className="text-teal-300">Ví hiện tại + Thẻ mới</strong>.
        </p>
      </div>

      {error && <ErrorNotice message={error} className="mb-4" />}

      {/* Candidate Card Picker */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
          1. Chọn thẻ ứng viên bạn đang cân nhắc mở
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Lọc nhanh các dòng thẻ trên thị trường chưa có trong ví của bạn:
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
          <LoadingSpinner label="Đang tải danh sách thẻ ứng viên..." />
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
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="truncate">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider block ${
                        isSelected ? 'text-teal-300' : 'text-teal-700'
                      }`}
                    >
                      {bankName}
                    </span>
                    <span className="text-xs font-bold truncate block">{c.name}</span>
                    <span
                      className={`text-[11px] block ${
                        isSelected ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      Phí: {c.annual_fee === 0 ? '0 ₫' : formatVND(c.annual_fee)}
                    </span>
                  </div>
                  {isSelected && <Zap className="w-4 h-4 text-teal-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Đang chọn:{' '}
            <strong className="text-slate-900">
              {selectedCard ? selectedCard.name : 'Chưa chọn'}
            </strong>
          </span>

          <Button
            size="md"
            loading={simulating}
            disabled={!selectedCardId}
            onClick={() => handleSimulate(selectedCardId)}
            icon={<Sparkles className="w-4 h-4 text-teal-400" />}
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            Chạy mô phỏng so sánh
          </Button>
        </div>
      </div>

      {/* Simulation Results View */}
      {simResult && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6 animate-slideUp">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                Kết quả mô phỏng
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                Đánh giá tác động khi mở thêm {simResult.new_card_name}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={addedSuccess ? 'secondary' : 'primary'}
                size="sm"
                loading={addingToWallet}
                onClick={handleAddSimulatedCard}
                icon={addedSuccess ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Plus className="w-3.5 h-3.5" />}
              >
                {addedSuccess ? 'Đã có trong ví' : 'Thêm thẻ này vào ví'}
              </Button>
            </div>
          </div>

          {/* Comparison Cards: CURRENT WALLET vs CURRENT + NEW CARD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Box 1: Current Wallet */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Ví hiện tại (Current Wallet)
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-800">
                {formatVND(simResult.current_estimated_annual_reward)}
                <span className="text-xs font-normal text-slate-400"> / năm</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Tổng lợi ích hoàn thưởng ước tính mỗi năm từ các thẻ bạn đang có.
              </p>
            </div>

            {/* Box 2: Current + New Card */}
            <div className="bg-teal-50/70 rounded-2xl p-5 border border-teal-200/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block">
                Ví mới sau khi thêm thẻ
              </span>
              <div className="text-xl sm:text-2xl font-black text-teal-950">
                {formatVND(simResult.simulated_estimated_annual_reward)}
                <span className="text-xs font-normal text-teal-700"> / năm</span>
              </div>
              <p className="text-[11px] text-teal-700">
                Lợi ích tối ưu kết hợp cùng thẻ {simResult.new_card_name}.
              </p>
            </div>

            {/* Box 3: Delta Difference */}
            <div
              className={`rounded-2xl p-5 border space-y-2 ${
                simResult.annual_difference > 0
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                Mức tăng thêm ròng (Annual Gain)
              </span>
              <div className="text-2xl font-black">
                {simResult.annual_difference > 0 ? '+' : ''}
                {formatVND(simResult.annual_difference)}
                <span className="text-xs font-normal opacity-70"> / năm</span>
              </div>
              <p className="text-[11px] opacity-80">
                {simResult.annual_difference > 0
                  ? 'Ví của bạn sẽ được nâng cấp quyền lợi đáng kể!'
                  : 'Chiếc thẻ này không đem lại thêm giá trị vượt trội so với các thẻ bạn đang có.'}
              </p>
            </div>
          </div>

          {/* Improved Categories Table */}
          <div className="pt-2">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>
                Các danh mục chi tiêu được cải thiện ({simResult.improved_categories.length})
              </span>
            </h4>

            {simResult.improved_categories.length > 0 ? (
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5 pl-4">Danh mục</th>
                        <th className="p-3.5">Thẻ cũ đang dùng</th>
                        <th className="p-3.5">Thẻ mới tối ưu</th>
                        <th className="p-3.5 text-right">Lợi ích cũ / năm</th>
                        <th className="p-3.5 text-right">Lợi ích mới / năm</th>
                        <th className="p-3.5 pr-4 text-right">Mức tăng thêm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {simResult.improved_categories.map((imp, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 pl-4 font-bold text-slate-900">{imp.category}</td>
                          <td className="p-3.5 text-slate-500">
                            {imp.previous_card || 'Chưa có thẻ mạnh'}
                          </td>
                          <td className="p-3.5 text-teal-800 font-bold">{imp.new_card}</td>
                          <td className="p-3.5 text-right text-slate-400">
                            {formatVND(imp.previous_annual_reward)}
                          </td>
                          <td className="p-3.5 text-right font-bold text-slate-800">
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
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">
                  Không có danh mục nào được cải thiện thêm.
                </p>
                <p className="text-[11px] text-slate-400">
                  Các thẻ trong ví hiện tại của bạn đã đủ tốt hoặc thẻ ứng viên này trùng lặp quyền
                  lợi với danh mục bạn chi tiêu.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
