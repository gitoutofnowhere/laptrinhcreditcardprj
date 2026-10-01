import { apiClient } from './client';
import { SpendingProfileOut, SpendingCategoryItem, SpendingProfileUpdate } from '../types/spending';

export async function getSpendingProfile(): Promise<SpendingProfileOut> {
  return apiClient<SpendingProfileOut>('/spending-profile');
}

export async function updateSpendingProfile(items: SpendingCategoryItem[]): Promise<SpendingProfileOut> {
  return apiClient<SpendingProfileOut>('/spending-profile', {
    method: 'PUT',
    body: JSON.stringify({ items } as SpendingProfileUpdate),
  });
}
