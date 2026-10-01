export interface BankOut {
  id: number;
  bank_id: string;
  name: string;
  website?: string | null;
  logo_url?: string | null;
  status?: string | null;
}

export interface CardBenefitOut {
  id: number;
  card_id: string;
  category: string;
  benefit_type: string;
  benefit_value: number;
  benefit_unit: string;
  maximum_benefit?: number | null;
  minimum_spend?: number | null;
  frequency?: string | null;
  conditions?: string | null;
  status?: string | null;
}

export interface CardMerchantOut {
  id: number;
  card_id: string;
  merchant_id: string;
  merchant_name?: string | null;
  relationship_type?: string | null;
  benefit_type?: string | null;
  benefit_value?: number | null;
  benefit_unit?: string | null;
  maximum_benefit?: number | null;
  minimum_spend?: number | null;
  conditions?: string | null;
  status?: string | null;
}

export interface CardOut {
  id: number;
  card_id: string;
  bank_id: string;
  name: string;
  network?: string | null;
  card_tier?: string | null;
  card_type?: string | null;
  annual_fee?: number | null;
  annual_fee_waiver_condition?: string | null;
  minimum_income?: number | null;
  application_url?: string | null;
  image_url?: string | null;
  status?: string | null;
}

export interface CardDetailOut extends CardOut {
  bank?: BankOut | null;
  benefits: CardBenefitOut[];
  merchants: CardMerchantOut[];
}

export interface CardCompareRequest {
  card_ids: string[];
}

export interface CardCompareItem {
  card_id: string;
  name: string;
  bank_name?: string | null;
  annual_fee?: number | null;
  minimum_income?: number | null;
  network?: string | null;
  card_tier?: string | null;
  top_benefits: string[];
  merchant_deals_count: number;
}

export interface CardCompareResponse {
  compared_cards: CardCompareItem[];
}
