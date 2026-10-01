import { apiClient } from './client';
import { CardOut, CardDetailOut, CardCompareRequest, CardCompareResponse } from '../types/card';

export interface CardFilterParams {
  bank_id?: string;
  network?: string;
  card_tier?: string;
  category?: string;
  benefit_type?: string;
  merchant_id?: string;
}

export async function getCards(params?: CardFilterParams): Promise<CardOut[]> {
  return apiClient<CardOut[]>('/cards', { params: params as any });
}

export async function getCardDetail(cardId: string): Promise<CardDetailOut> {
  return apiClient<CardDetailOut>(`/cards/${encodeURIComponent(cardId)}`);
}

export async function compareCards(cardIds: string[]): Promise<CardCompareResponse> {
  return apiClient<CardCompareResponse>('/cards/compare', {
    method: 'POST',
    body: JSON.stringify({ card_ids: cardIds } as CardCompareRequest),
  });
}
