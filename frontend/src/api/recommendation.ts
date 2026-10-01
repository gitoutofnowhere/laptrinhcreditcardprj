import { apiClient } from './client';
import { RecommendationRequest, RecommendationResponse } from '../types/recommendation';

export async function getRecommendation(req: RecommendationRequest): Promise<RecommendationResponse> {
  return apiClient<RecommendationResponse>('/recommendation', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}
