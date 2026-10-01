import { apiClient } from './client';
import { SimulationRequest, SimulationResponse } from '../types/simulation';

export async function simulateNewCard(newCardId: string): Promise<SimulationResponse> {
  return apiClient<SimulationResponse>('/wallet/simulate', {
    method: 'POST',
    body: JSON.stringify({ new_card_id: newCardId } as SimulationRequest),
  });
}
