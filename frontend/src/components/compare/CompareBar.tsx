import React from 'react';
import { CardOut } from '../../types/card';
import { Scale, X, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

interface CompareBarProps {
  selectedCards: CardOut[];
  onRemoveCard: (cardId: string) => void;
  onClearAll: () => void;
  onOpenCompare: () => void;
}

export const CompareBar: React.FC<CompareBarProps> = ({
  selectedCards,
  onRemoveCard,
  onClearAll,
  onOpenCompare,
}) => {
  if (selectedCards.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-ink text-white p-3.5 px-4 rounded-2xl shadow-2xl border border-ink-800 flex items-center justify-between gap-4 animate-slideUp">
      <div className="flex items-center gap-3 overflow-x-auto py-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-sun shrink-0">
          <Scale className="w-4 h-4" />
          <span>So sánh card ({selectedCards.length}/3):</span>
        </div>

        <div className="flex items-center gap-2">
          {selectedCards.map((c) => (
            <div
              key={c.card_id}
              className="flex items-center gap-1.5 bg-ink-800/90 text-xs px-2.5 py-1 rounded-xl border border-ink-700 max-w-[150px] shrink-0"
            >
              <span className="truncate font-medium">{c.name}</span>
              <button
                onClick={() => onRemoveCard(c.card_id)}
                className="text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-slate-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onClearAll}
          className="text-xs text-slate-400 hover:text-white px-2 py-1 transition-colors"
        >
          Bỏ hết
        </button>
        <Button
          size="sm"
          onClick={onOpenCompare}
          className="bg-[#ffc93c] hover:bg-[#f5be2b] text-ink font-bold shadow-press border border-ink/20"
          icon={<ArrowRight className="w-3.5 h-3.5 text-ink" />}
        >
          So sánh ngay →
        </Button>
      </div>
    </div>
  );
};
