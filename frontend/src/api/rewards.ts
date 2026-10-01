import { apiClient } from './client';
import { RewardCalcRequest, RewardCalcResponse } from '../types/rewards';

export async function calculateReward(req: RewardCalcRequest): Promise<RewardCalcResponse> {
  return apiClient<RewardCalcResponse>('/rewards/calculate', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}
