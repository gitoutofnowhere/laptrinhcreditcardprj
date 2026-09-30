import os
import sys
import pandas as pd

# Add root directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.core.database import SessionLocal, engine
from app.models import Base, Bank, Card, CardBenefit, Merchant, CardMerchant
from scripts.validate_dataset import validate_dataset, DATASET_PATH

def clean_value(val):
    """Guarantees pandas NaN/NaT is converted to Python None."""
    if pd.isna(val) or val is None:
        return None
    return val

def seed_database():
    print("Step 1: Validating dataset...")
    is_valid = validate_dataset()
    if not is_valid:
        print("ERROR: Dataset validation failed. Seeding aborted.")
        sys.exit(1)

    print("Step 2: Connecting to database & resetting seed data...")
    db = SessionLocal()

    try:
        # Delete existing data in reverse FK order
        db.query(CardMerchant).delete()
        db.query(CardBenefit).delete()
        db.query(Card).delete()
        db.query(Merchant).delete()
        db.query(Bank).delete()
        db.commit()

        xl = pd.ExcelFile(DATASET_PATH)

        # 1. Seed Banks
        banks_df = pd.read_excel(xl, 'Banks')
        banks_df = banks_df.where(pd.notnull(banks_df), None)
        bank_inserted_count = 0
        for _, row in banks_df.iterrows():
            bank = Bank(
                bank_id=clean_value(row['bank_id']),
                name=clean_value(row['name']),
                website=clean_value(row['website']),
                logo_url=None,
                status="active"
            )
            db.add(bank)
            bank_inserted_count += 1
        db.commit()

        # 2. Seed Cards
        cards_df = pd.read_excel(xl, 'Cards')
        cards_df = cards_df.where(pd.notnull(cards_df), None)
        card_inserted_count = 0
        for _, row in cards_df.iterrows():
            card = Card(
                card_id=clean_value(row['card_id']),
                bank_id=clean_value(row['bank_id']),
                name=clean_value(row['name']),
                network=clean_value(row['network']),
                card_tier=clean_value(row['card_tier']),
                annual_fee=int(row['annual_fee']) if clean_value(row['annual_fee']) is not None else None,
                minimum_income=int(row['minimum_income']) if clean_value(row['minimum_income']) is not None else None,
                status=clean_value(row['status']) or "active",
                card_type=None,
                annual_fee_waiver_condition=None,
                application_url=None,
                image_url=None
            )
            db.add(card)
            card_inserted_count += 1
        db.commit()

        # 3. Seed CardBenefits
        benefits_df = pd.read_excel(xl, 'Card_Benefits')
        benefits_df = benefits_df.where(pd.notnull(benefits_df), None)
        benefit_inserted_count = 0
        for _, row in benefits_df.iterrows():
            benefit = CardBenefit(
                card_id=clean_value(row['card_id']),
                category=clean_value(row['category']),
                benefit_type=clean_value(row['benefit_type']),
                benefit_value=float(row['benefit_value']) if clean_value(row['benefit_value']) is not None else None,
                benefit_unit=clean_value(row['benefit_unit']),
                maximum_benefit=float(row['maximum_benefit']) if clean_value(row['maximum_benefit']) is not None else None,
                minimum_spend=float(row['minimum_spend']) if clean_value(row['minimum_spend']) is not None else 0,
                frequency=clean_value(row['frequency']),
                conditions=clean_value(row['conditions']),
                status=clean_value(row['status']) or "current",
                valid_from=None,
                valid_to=None,
                source_url=None,
                last_verified_at=None
            )
            db.add(benefit)
            benefit_inserted_count += 1
        db.commit()

        # 4. Seed Merchants
        merchants_df = pd.read_excel(xl, 'Merchants')
        merchants_df = merchants_df.where(pd.notnull(merchants_df), None)
        merchant_inserted_count = 0
        for _, row in merchants_df.iterrows():
            merchant = Merchant(
                merchant_id=clean_value(row['merchant_id']),
                merchant_name=clean_value(row['merchant_name']),
                normalized_name=clean_value(row['normalized_name']),
                category=clean_value(row['category']),
                logo_url=None,
                website=None,
                status="active"
            )
            db.add(merchant)
            merchant_inserted_count += 1
        db.commit()

        # 5. Seed CardMerchants
        cm_df = pd.read_excel(xl, 'Card_Merchants')
        cm_df = cm_df.where(pd.notnull(cm_df), None)
        cm_inserted_count = 0
        for _, row in cm_df.iterrows():
            cm = CardMerchant(
                card_id=clean_value(row['card_id']),
                merchant_id=clean_value(row['merchant_id']),
                relationship_type=clean_value(row['relationship_type']),
                benefit_type=clean_value(row['benefit_type']),
                benefit_value=float(row['benefit_value']) if clean_value(row['benefit_value']) is not None else None,
                benefit_unit=clean_value(row['benefit_unit']),
                maximum_benefit=float(row['maximum_benefit']) if clean_value(row['maximum_benefit']) is not None else None,
                minimum_spend=float(row['minimum_spend']) if clean_value(row['minimum_spend']) is not None else 0,
                conditions=clean_value(row['conditions']),
                status=clean_value(row['status']) or "current",
                valid_from=None,
                valid_to=None,
                source_url=None,
                last_verified_at=None
            )
            db.add(cm)
            cm_inserted_count += 1
        db.commit()

        print("\n================ DATABASE SEED SUCCESS SUMMARY ================")
        print(f"  Banks:          {bank_inserted_count} / {len(banks_df)} rows inserted")
        print(f"  Cards:          {card_inserted_count} / {len(cards_df)} rows inserted")
        print(f"  Card_Benefits:  {benefit_inserted_count} / {len(benefits_df)} rows inserted")
        print(f"  Merchants:      {merchant_inserted_count} / {len(merchants_df)} rows inserted")
        print(f"  Card_Merchants: {cm_inserted_count} / {len(cm_df)} rows inserted")
        print("\nNull-handled fields (stored as NULL due to absence or NaN in Excel):")
        print("  - Cards: card_type, annual_fee_waiver_condition, application_url, image_url")
        print("  - Card_Benefits: maximum_benefit (partial NaN), valid_from, valid_to, source_url, last_verified_at")
        print("  - Merchants: logo_url, website, status")
        print("  - Card_Merchants: benefit_value (partial NaN), maximum_benefit (partial NaN), conditions (partial NaN), valid_from, valid_to, source_url, last_verified_at")
        print("=================================================================\n")

    except Exception as e:
        db.rollback()
        print(f"ERROR during seeding: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
