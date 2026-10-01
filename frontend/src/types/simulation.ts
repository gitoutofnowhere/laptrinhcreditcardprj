export interface SimulationRequest {
  new_card_id: string;
}

export interface ImprovedCategoryDetail {
  category: string;
  previous_card?: string | null;
  previous_annual_reward: number;
  new_card: string;
  new_annual_reward: number;
  annual_gain: number;
}

export interface SimulationResponse {
  new_card_id: string;
  new_card_name: string;
  current_estimated_annual_reward: number;
  simulated_estimated_annual_reward: number;
  annual_difference: number;
  improved_categories: ImprovedCategoryDetail[];
}
