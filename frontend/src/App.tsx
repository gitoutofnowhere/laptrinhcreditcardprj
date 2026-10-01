import React, { useState, useEffect } from 'react';
import { CardOut } from './types/card';
import { WalletCardOut } from './types/wallet';
import { getCards } from './api/cards';
import { getWallet, addCardToWallet, removeCardFromWallet } from './api/wallet';
import { Navbar, NavTab } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { RecommendPage } from './pages/RecommendPage';
import { ExploreCardsPage } from './pages/ExploreCardsPage';
import { WalletPage } from './pages/WalletPage';
import { ComparePage } from './pages/ComparePage';
import { CardDetailModal } from './components/cards/CardDetailModal';
import { CompareBar } from './components/compare/CompareBar';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [walletCards, setWalletCards] = useState<WalletCardOut[]>([]);
  const [allCards, setAllCards] = useState<CardOut[]>([]);
  const [comparedCards, setComparedCards] = useState<CardOut[]>([]);
  const [activeDetailCard, setActiveDetailCard] = useState<CardOut | null>(null);
  const [loadingWalletCardId, setLoadingWalletCardId] = useState<string | null>(null);

  // Derived sets
  const walletCardIds = new Set(walletCards.map((w) => w.card_id));
  const comparedCardIds = new Set(comparedCards.map((c) => c.card_id));

  // Initial data load
  const loadInitialData = async () => {
    try {
      const [walletData, cardsData] = await Promise.all([getWallet(), getCards()]);
      setWalletCards(walletData);
      setAllCards(cardsData);
    } catch (err) {
      console.error('Error loading initial Cardy data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Card detail modal lookup by ID
  const handleViewDetailById = (cardId: string) => {
    const found = allCards.find((c) => c.card_id === cardId);
    if (found) {
      setActiveDetailCard(found);
    } else {
      // Fallback placeholder card object to trigger API detail fetch
      setActiveDetailCard({
        id: 0,
        card_id: cardId,
        bank_id: '',
        name: cardId,
      });
    }
  };

  // Add / remove card from wallet
  const handleAddCardToWallet = async (cardId: string) => {
    setLoadingWalletCardId(cardId);
    try {
      const added = await addCardToWallet(cardId);
      // Attach card details if missing
      const cardObj = allCards.find((c) => c.card_id === cardId);
      const enriched: WalletCardOut = {
        ...added,
        card: cardObj || added.card,
      };
      setWalletCards((prev) => [...prev.filter((w) => w.card_id !== cardId), enriched]);
    } catch (err: any) {
      alert(err.message || 'Không thể thêm card vào ví.');
    } finally {
      setLoadingWalletCardId(null);
    }
  };

  const handleRemoveCardFromWallet = async (cardId: string) => {
    setLoadingWalletCardId(cardId);
    try {
      await removeCardFromWallet(cardId);
      setWalletCards((prev) => prev.filter((w) => w.card_id !== cardId));
    } catch (err: any) {
      alert(err.message || 'Không thể gỡ card khỏi ví.');
    } finally {
      setLoadingWalletCardId(null);
    }
  };

  const handleToggleWallet = async (card: CardOut) => {
    if (walletCardIds.has(card.card_id)) {
      await handleRemoveCardFromWallet(card.card_id);
    } else {
      await handleAddCardToWallet(card.card_id);
    }
  };

  // Comparison toggle
  const handleToggleCompare = (card: CardOut) => {
    setComparedCards((prev) => {
      const exists = prev.some((c) => c.card_id === card.card_id);
      if (exists) {
        return prev.filter((c) => c.card_id !== card.card_id);
      }
      if (prev.length >= 3) {
        alert('Bạn chỉ có thể so sánh tối đa 3 card cùng lúc nhé.');
        return prev;
      }
      return [...prev, card];
    });
  };

  const handleRemoveComparedCard = (cardId: string) => {
    setComparedCards((prev) => prev.filter((c) => c.card_id !== cardId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        compareCount={comparedCards.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            walletCount={walletCards.length}
          />
        )}

        {currentTab === 'recommend' && (
          <RecommendPage
            walletCardIds={walletCardIds}
            onViewDetailById={handleViewDetailById}
            onToggleWalletById={(cardId) => {
              const card = allCards.find((c) => c.card_id === cardId);
              if (card) handleToggleWallet(card);
              else handleAddCardToWallet(cardId);
            }}
            loadingWalletCardId={loadingWalletCardId}
          />
        )}

        {currentTab === 'explore' && (
          <ExploreCardsPage
            walletCardIds={walletCardIds}
            comparedCardIds={comparedCardIds}
            onViewDetail={(card) => setActiveDetailCard(card)}
            onToggleWallet={handleToggleWallet}
            onToggleCompare={handleToggleCompare}
            loadingWalletCardId={loadingWalletCardId}
          />
        )}

        {currentTab === 'wallet' && (
          <WalletPage
            walletCards={walletCards}
            ownedCardIds={walletCardIds}
            onAddCardToWallet={handleAddCardToWallet}
            onRemoveCardFromWallet={handleRemoveCardFromWallet}
            onViewDetail={(card) => setActiveDetailCard(card)}
            onViewCardDetailById={handleViewDetailById}
          />
        )}

        {currentTab === 'compare' && (
          <ComparePage
            comparedCards={comparedCards}
            onAddMore={() => setCurrentTab('explore')}
            onRemoveCard={handleRemoveComparedCard}
            onViewDetail={(card) => setActiveDetailCard(card)}
            walletCardIds={walletCardIds}
            onToggleWallet={handleToggleWallet}
          />
        )}
      </main>

      {/* Floating Compare Bar */}
      {currentTab !== 'compare' && (
        <CompareBar
          selectedCards={comparedCards}
          onRemoveCard={handleRemoveComparedCard}
          onClearAll={() => setComparedCards([])}
          onOpenCompare={() => {
            setCurrentTab('compare');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Global Card Detail Modal */}
      <CardDetailModal
        card={activeDetailCard}
        isOpen={activeDetailCard !== null}
        onClose={() => setActiveDetailCard(null)}
        isInWallet={activeDetailCard ? walletCardIds.has(activeDetailCard.card_id) : false}
        onToggleWallet={handleToggleWallet}
        loadingWallet={
          activeDetailCard ? loadingWalletCardId === activeDetailCard.card_id : false
        }
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
