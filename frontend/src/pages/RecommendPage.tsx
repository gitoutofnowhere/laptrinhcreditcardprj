import React, { useState } from 'react';
import { PurchaseAssistant } from '../components/recommendation/PurchaseAssistant';
import { FindCardWizard } from '../components/recommendation/FindCardWizard';
import { ShoppingBag, CreditCard } from 'lucide-react';

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
      <div className="text-center max-w-xl mx-auto space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Hệ thống cố vấn thẻ thông minh
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Chọn tình huống thực tế của bạn để nhận đề xuất chính xác và tối ưu nhất.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/70 border border-slate-300/50 shadow-inner">
          <button
            type="button"
            onClick={() => setMode('purchase')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'purchase'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-teal-600" />
            <span>Quẹt thẻ cho đơn hàng sắp mua</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('open')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'open'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <span>Tư vấn mở thẻ tín dụng mới</span>
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
