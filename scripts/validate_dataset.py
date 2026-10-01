import os
import sys
import pandas as pd
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DATASET_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "RightCard_Database_MVP.csv")

def validate_dataset():
    if not os.path.exists(DATASET_PATH):
        print(f"ERROR: File not found at {DATASET_PATH}")
        return False

    xl = pd.ExcelFile(DATASET_PATH)
    sheet_names = xl.sheet_names
    
    required_sheets = ['Banks', 'Cards', 'Card_Benefits', 'Merchants', 'Card_Merchants']
    for req in required_sheets:
        if req not in sheet_names:
            print(f"ERROR: Missing required sheet: {req}")
            return False

    banks_df = pd.read_excel(xl, 'Banks')
    cards_df = pd.read_excel(xl, 'Cards')
    benefits_df = pd.read_excel(xl, 'Card_Benefits')
    merchants_df = pd.read_excel(xl, 'Merchants')
    card_merchants_df = pd.read_excel(xl, 'Card_Merchants')

    errors = []
    warnings = []

    # --- 1. Banks Validation ---
    bank_ids = set(banks_df['bank_id'].dropna())
    if len(bank_ids) != len(banks_df):
        errors.append("Duplicate bank_id detected in Banks sheet")
    
    proposed_bank_absent = ['logo_url', 'status']
    for field in proposed_bank_absent:
        warnings.append(f"Banks: '{field}' missing from dataset; will be stored as NULL")

    # --- 2. Cards Validation ---
    card_ids = set(cards_df['card_id'].dropna())
    if len(card_ids) != len(cards_df):
        errors.append("Duplicate card_id detected in Cards sheet")

    missing_bank_refs = set(cards_df['bank_id']) - bank_ids
    if missing_bank_refs:
        errors.append(f"Cards reference invalid bank_ids: {missing_bank_refs}")

    proposed_card_absent = ['card_type', 'annual_fee_waiver_condition', 'application_url', 'image_url']
    for field in proposed_card_absent:
        warnings.append(f"Cards: '{field}' missing from dataset; will be stored as NULL")

    # --- 3. Card_Benefits Validation ---
    missing_card_benefits_refs = set(benefits_df['card_id']) - card_ids
    if missing_card_benefits_refs:
        errors.append(f"Card_Benefits reference invalid card_ids: {missing_card_benefits_refs}")

    max_benefit_nulls = benefits_df['maximum_benefit'].isnull().sum()
    if max_benefit_nulls > 0:
        warnings.append(f"Card_Benefits: 'maximum_benefit' contains {max_benefit_nulls} missing/NaN values; will be stored as NULL")

    proposed_benefit_absent = ['valid_from', 'valid_to', 'source_url', 'last_verified_at']
    for field in proposed_benefit_absent:
        warnings.append(f"Card_Benefits: '{field}' missing from dataset; will be stored as NULL")

    # --- 4. Merchants Validation ---
    merchant_ids = set(merchants_df['merchant_id'].dropna())
    if len(merchant_ids) != len(merchants_df):
        errors.append("Duplicate merchant_id detected in Merchants sheet")

    proposed_merchant_absent = ['logo_url', 'website', 'status']
    for field in proposed_merchant_absent:
        warnings.append(f"Merchants: '{field}' missing from dataset; will be stored as NULL")

    # --- 5. Card_Merchants Validation ---
    missing_cm_card_refs = set(card_merchants_df['card_id']) - card_ids
    if missing_cm_card_refs:
        errors.append(f"Card_Merchants reference invalid card_ids: {missing_cm_card_refs}")

    missing_cm_merchant_refs = set(card_merchants_df['merchant_id']) - merchant_ids
    if missing_cm_merchant_refs:
        errors.append(f"Card_Merchants reference invalid merchant_ids: {missing_cm_merchant_refs}")

    benefit_val_nulls = card_merchants_df['benefit_value'].isnull().sum()
    if benefit_val_nulls > 0:
        warnings.append(f"Card_Merchants: 'benefit_value' contains {benefit_val_nulls} missing/NaN values; will be stored as NULL")

    cm_max_benefit_nulls = card_merchants_df['maximum_benefit'].isnull().sum()
    if cm_max_benefit_nulls > 0:
        warnings.append(f"Card_Merchants: 'maximum_benefit' contains {cm_max_benefit_nulls} missing/NaN values; will be stored as NULL")

    conditions_nulls = card_merchants_df['conditions'].isnull().sum()
    if conditions_nulls > 0:
        warnings.append(f"Card_Merchants: 'conditions' contains {conditions_nulls} missing/NaN values; will be stored as NULL")

    proposed_cm_absent = ['valid_from', 'valid_to', 'source_url', 'last_verified_at']
    for field in proposed_cm_absent:
        warnings.append(f"Card_Merchants: '{field}' missing from dataset; will be stored as NULL")

    # Print Summary
    print("\n================ DATASET VALIDATION REPORT ================")
    print(f"Total Sheets Inspected: {len(sheet_names)}")
    print(f"Row Counts:")
    print(f"  - Banks: {len(banks_df)}")
    print(f"  - Cards: {len(cards_df)}")
    print(f"  - Card_Benefits: {len(benefits_df)}")
    print(f"  - Merchants: {len(merchants_df)}")
    print(f"  - Card_Merchants: {len(card_merchants_df)}")
    print(f"\nErrors Count: {len(errors)}")
    for e in errors:
        print(f"  [ERROR] {e}")

    print(f"\nWarnings Count: {len(warnings)}")
    for w in warnings:
        print(f"  [WARNING] {w}")

    print("===========================================================\n")
    return len(errors) == 0

if __name__ == "__main__":
    validate_dataset()
