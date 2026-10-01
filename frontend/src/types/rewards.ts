export interface RewardCalcRequest {
  card_id: string;
  merchant_id?: string | null;
  category?: string | null;
  amount: number;
}

export interface RewardCalcResponse {
  card_id: string;
  card_name: string;
  category?: string | null;
  merchant_id?: string | null;
  benefit_type?: string | null;
  benefit_value?: number | null;
  benefit_unit?: string | null;
  estimated_reward_value: number;
  conditions_note?: string | null;
}
