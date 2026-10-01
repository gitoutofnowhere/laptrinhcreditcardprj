import { apiClient } from './client';
import { WalletCardOut, WalletOptimizationResult } from '../types/wallet';

export async function getWallet(): Promise<WalletCardOut[]> {
  return apiClient<WalletCardOut[]>('/wallet');
}

export async function addCardToWallet(cardId: string): Promise<WalletCardOut> {
  return apiClient<WalletCardOut>('/wallet/cards', {
    method: 'POST',
    body: JSON.stringify({ card_id: cardId }),
  });
}

export async function removeCardFromWallet(cardId: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/wallet/cards/${encodeURIComponent(cardId)}`, {
    method: 'DELETE',
  });
}

export async function optimizeWallet(): Promise<WalletOptimizationResult> {
  return apiClient<WalletOptimizationResult>('/wallet/optimize', {
    method: 'POST',
  });
}
