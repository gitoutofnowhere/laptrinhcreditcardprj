export interface SpendingCategoryItem {
  category: string;
  monthly_amount: number;
}

export interface SpendingProfileUpdate {
  items: SpendingCategoryItem[];
}

export interface SpendingProfileItemOut {
  id: number;
  user_id: number;
  category: string;
  monthly_amount: number;
}

export interface SpendingProfileOut {
  user_id: number;
  items: SpendingProfileItemOut[];
  total_monthly_spending: number;
}
