import React, { useState } from 'react';
import { PurchaseAssistant } from '../components/recommendation/PurchaseAssistant';
import { FindCardWizard } from '../components/recommendation/FindCardWizard';
import { ShoppingBag, CreditCard, Sparkles } from 'lucide-react';

interface RecommendPageProps {
  walletCardIds: Set<string>;
  onViewDetailById: (cardId: string) => void;
  onToggleWalletById: (cardId: string) => void;
  loadingWalletCardId?: string | null;
  initialMode?: 'purchase' | 'open';
}

export const RecommendPage: React.FC<RecommendPageProps> = ({
  walletCardIds,
  onViewDetailById,
  onToggleWalletById,
  loadingWalletCardId,
  initialMode = 'purchase',
}) => {
  const [mode, setMode] = useState<'purchase' | 'open'>(initialMode);

  return (
    <div className="space-y-8 py-6 animate-fadeIn">
      {/* Page Title & Intro */}
      <div className="text-center max-w-xl mx-auto space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-sun" />
          <span>Gợi ý card theo nhu cầu</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Không biết chọn card nào? Cardy xem chooo
        </h1>
        <p className="text-xs sm:text-sm text-ink-2">
          Kể Cardy nghe bạn chuẩn bị mua gì hoặc muốn mở thẻ mới, Cardy tìm ngay chiếc card hợp gu nhất.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-white border border-line shadow-card">
          <button
            type="button"
            onClick={() => setMode('purchase')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'purchase'
                ? 'bg-blue-600 text-white shadow-press'
                : 'text-ink-2 hover:text-navy-900 hover:bg-blue-50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Đi đâu, card gì?</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('open')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'open'
                ? 'bg-blue-600 text-white shadow-press'
                : 'text-ink-2 hover:text-navy-900 hover:bg-blue-50'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Tìm card mở mới</span>
          </button>
        </div>
      </div>

      {/* Active Form */}
      <div>
        {mode === 'purchase' ? (
          <PurchaseAssistant
            walletCardIds={walletCardIds}
            onViewDetailById={onViewDetailById}
            onToggleWalletById={onToggleWalletById}
            loadingWalletCardId={loadingWalletCardId}
          />
        ) : (
          <FindCardWizard
            walletCardIds={walletCardIds}
            onViewDetailById={onViewDetailById}
            onToggleWalletById={onToggleWalletById}
            loadingWalletCardId={loadingWalletCardId}
          />
        )}
      </div>
    </div>
  );
};
