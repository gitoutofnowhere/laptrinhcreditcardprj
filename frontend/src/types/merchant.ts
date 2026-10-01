export interface MerchantOut {
  id: number;
  merchant_id: string;
  merchant_name: string;
  normalized_name?: string | null;
  category?: string | null;
  logo_url?: string | null;
  website?: string | null;
  status?: string | null;
}

export interface CategoryListResponse {
  categories: string[];
}
