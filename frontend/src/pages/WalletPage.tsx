import React, { useState } from 'react';
import { WalletCardOut } from '../types/wallet';
import { CardOut } from '../types/card';
import { WalletCardsList } from '../components/wallet/WalletCardsList';
import { WalletOptimizerView } from '../components/wallet/WalletOptimizerView';
import { SpendingProfileEditor } from '../components/wallet/SpendingProfileEditor';
import { WhatIfSimulator } from '../components/wallet/WhatIfSimulator';
import { AddCardModal } from '../components/wallet/AddCardModal';
import { Wallet, Sparkles, PieChart, TrendingUp, CreditCard, Plus } from 'lucide-react';
import { Button } from '../components/common/Button';

interface WalletPageProps {
  walletCards: WalletCardOut[];
  ownedCardIds: Set<string>;
  onAddCardToWallet: (cardId: string) => Promise<void>;
  onRemoveCardFromWallet: (cardId: string) => Promise<void>;
  onViewDetail: (card: CardOut) => void;
  onViewCardDetailById: (cardId: string) => void;
  initialTab?: 'cards' | 'optimize' | 'spending' | 'simulate';
}

export const WalletPage: React.FC<WalletPageProps> = ({
  walletCards,
  ownedCardIds,
  onAddCardToWallet,
  onRemoveCardFromWallet,
  onViewDetail,
  onViewCardDetailById,
  initialTab,
}) => {
  // Default to optimize if user already has cards, otherwise cards
  const [activeTab, setActiveTab] = useState<'cards' | 'optimize' | 'spending' | 'simulate'>(
    initialTab || (walletCards.length > 0 ? 'optimize' : 'cards')
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const tabs = [
    {
      id: 'optimize' as const,
      label: 'Bản đồ quẹt thẻ tối ưu',
      icon: Sparkles,
      desc: 'Phân bổ thẻ theo danh mục',
    },
    {
      id: 'cards' as const,
      label: `Thẻ trong ví (${walletCards.length})`,
      icon: CreditCard,
      desc: 'Quản lý các thẻ đang có',
    },
    {
      id: 'simulate' as const,
      label: 'Mô phỏng mở thêm thẻ',
      icon: TrendingUp,
      desc: 'Đánh giá thẻ ứng viên',
    },
    {
      id: 'spending' as const,
      label: 'Hồ sơ chi tiêu',
      icon: PieChart,
      desc: 'Ngân sách chi tiêu tháng',
    },
  ];

  return (
    <div className="space-y-6 py-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 mb-2">
            <Wallet className="w-3.5 h-3.5 text-teal-600" />
            <span>Ví thông minh cá nhân</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Ví thẻ & Bản đồ hoàn thưởng
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý thẻ sở hữu, nhận hướng dẫn quẹt thẻ tối ưu theo từng nhóm ngành và mô phỏng giá trị khi mở thẻ mới.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
            className="bg-slate-900 text-white hover:bg-slate-800 font-bold"
          >
            Thêm thẻ vào ví
          </Button>
        </div>
      </div>

      {/* Wallet Tabs */}
      <div className="border-b border-slate-200 overflow-x-auto pb-px">
        <div className="flex items-center gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold transition-all ${
                  isActive
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === 'optimize' && (
          <WalletOptimizerView
            onGoToSimulation={() => setActiveTab('simulate')}
            onGoToSpending={() => setActiveTab('spending')}
            onViewCardDetailById={onViewCardDetailById}
          />
        )}

        {activeTab === 'cards' && (
          <WalletCardsList
            walletCards={walletCards}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onRemoveCard={onRemoveCardFromWallet}
            onViewDetail={onViewDetail}
          />
        )}

        {activeTab === 'simulate' && (
          <WhatIfSimulator
            ownedCardIds={ownedCardIds}
            onAddCardToWallet={onAddCardToWallet}
            onViewCardDetailById={onViewCardDetailById}
          />
        )}

        {activeTab === 'spending' && (
          <SpendingProfileEditor
            onProfileUpdated={() => {
              // Spending updated
            }}
          />
        )}
      </div>

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        ownedCardIds={ownedCardIds}
        onAddCard={async (cardId: string) => {
          await onAddCardToWallet(cardId);
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
};
