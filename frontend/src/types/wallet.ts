import { CardOut } from './card';

export interface WalletAddIn {
  card_id: string;
}

export interface WalletCardOut {
  id: number;
  user_id: number;
  card_id: string;
  added_at: string;
  status?: string | null;
  card?: CardOut | null;
}

export interface CategoryRecommendation {
  category: string;
  monthly_spending: number;
  recommended_card_id: string;
  recommended_card_name: string;
  expected_monthly_reward: number;
  expected_annual_reward: number;
  reason: string;
}

export interface WeakCategory {
  category: string;
  monthly_amount: number;
  current_best_reward: number;
  reason: string;
}

export interface WalletOptimizationResult {
  user_id: number;
  total_monthly_spending: number;
  total_annual_reward: number;
  category_recommendations: CategoryRecommendation[];
  weak_categories: WeakCategory[];
  message?: string;
}
