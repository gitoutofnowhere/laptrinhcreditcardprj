import React from 'react';
import { CardOut } from '../types/card';
import { CompareView } from '../components/compare/CompareView';

interface ComparePageProps {
  comparedCards: CardOut[];
  onAddMore: () => void;
  onRemoveCard: (cardId: string) => void;
  onViewDetail: (card: CardOut) => void;
  walletCardIds: Set<string>;
  onToggleWallet?: (card: CardOut) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  comparedCards,
  onAddMore,
  onRemoveCard,
  onViewDetail,
  walletCardIds,
  onToggleWallet,
}) => {
  return (
    <div className="py-6 animate-fadeIn">
      <CompareView
        cards={comparedCards}
        onAddMore={onAddMore}
        onRemoveCard={onRemoveCard}
        onViewDetail={onViewDetail}
        walletCardIds={walletCardIds}
        onToggleWallet={onToggleWallet}
      />
    </div>
  );
};
