export type RecommendationMode = 'USE_EXISTING_CARD' | 'FIND_CARD_TO_OPEN';

export interface RecommendationRequest {
  mode: RecommendationMode;
  
  // Specific transaction context
  merchant_id?: string | null;
  category?: string | null;
  amount?: number | null;

  // Inputs for FIND_CARD_TO_OPEN
  monthly_income?: number | null;
  favorite_merchants?: string[];
  favorite_categories?: string[];
  primary_preference: string; // cashback, points, discount, travel, low_fee, merchant_benefits
  secondary_preferences?: string[];
  max_annual_fee?: number | null;
}

export interface RecommendedCard {
  card_id: string;
  name: string;
  bank_name?: string | null;
  score: number;
  estimated_value?: number | null;
  reasons: string[];
}

export interface AlternativeCard {
  rank: number;
  card_id: string;
  name: string;
  bank_name?: string | null;
  score: number;
  best_for: string;
}

export interface RecommendationResponse {
  mode: RecommendationMode;
  recommended_card: RecommendedCard;
  alternatives: AlternativeCard[];
}
