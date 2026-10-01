import { apiClient } from './client';
import { MerchantOut, CategoryListResponse } from '../types/merchant';

export interface MerchantFilterParams {
  category?: string;
  search?: string;
}

export async function getMerchants(params?: MerchantFilterParams): Promise<MerchantOut[]> {
  return apiClient<MerchantOut[]>('/merchants', { params: params as any });
}

export async function getCategories(): Promise<string[]> {
  try {
    const res = await apiClient<CategoryListResponse>('/categories');
    return res.categories || [];
  } catch {
    const res = await apiClient<CategoryListResponse>('/merchants/categories');
    return res.categories || [];
  }
}
