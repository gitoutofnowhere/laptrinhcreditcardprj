import os
import sys

# Ensure root workspace directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base, get_db
from app.main import app
from app.models import Bank, Card, CardBenefit, Merchant, CardMerchant, User, UserWallet, SpendingProfile

# Use SQLite in-memory database for fast, isolated tests
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    # Seed test data
    bank1 = Bank(bank_id="VPB", name="VPBank", website="https://vpbank.com.vn")
    bank2 = Bank(bank_id="TCB", name="Techcombank", website="https://techcombank.com")
    bank3 = Bank(bank_id="VCB", name="Vietcombank", website="https://vietcombank.com.vn")
    db.add_all([bank1, bank2, bank3])

    card1 = Card(
        card_id="VPB_STEPUP", bank_id="VPB", name="VPBank StepUp",
        network="Visa", card_tier="Gold", annual_fee=500000, minimum_income=10000000, status="active"
    )
    card2 = Card(
        card_id="VPB_SHOPEE", bank_id="VPB", name="VPBank Shopee",
        network="Visa", card_tier="Platinum", annual_fee=800000, minimum_income=15000000, status="active"
    )
    card3 = Card(
        card_id="TCB_EVERYDAY", bank_id="TCB", name="Techcombank Everyday",
        network="Visa", card_tier="Classic", annual_fee=0, minimum_income=5000000, status="active"
    )
    card4 = Card(
        card_id="VCB_DIGICARD", bank_id="VCB", name="Vietcombank DigiCard",
        network="Visa", card_tier="Classic", annual_fee=0, minimum_income=0, status="active"
    )
    db.add_all([card1, card2, card3, card4])

    cb1 = CardBenefit(
        card_id="VPB_STEPUP", category="Online", benefit_type="cashback",
        benefit_value=15.0, benefit_unit="percent", maximum_benefit=600000.0, minimum_spend=0, frequency="monthly"
    )
    cb2 = CardBenefit(
        card_id="VPB_SHOPEE", category="E-commerce", benefit_type="cashback",
        benefit_value=10.0, benefit_unit="percent", maximum_benefit=800000.0, minimum_spend=0, frequency="monthly"
    )
    cb3 = CardBenefit(
        card_id="TCB_EVERYDAY", category="Dining", benefit_type="cashback",
        benefit_value=5.0, benefit_unit="percent", maximum_benefit=300000.0, minimum_spend=0, frequency="monthly"
    )
    db.add_all([cb1, cb2, cb3])

    m1 = Merchant(merchant_id="SHOPEE", merchant_name="Shopee", normalized_name="Shopee", category="E-commerce")
    m2 = Merchant(merchant_id="GRAB", merchant_name="Grab", normalized_name="Grab", category="Ride Hailing")
    m3 = Merchant(merchant_id="PIZZA_4PS", merchant_name="Pizza 4P's", normalized_name="Pizza 4P's", category="Dining")
    db.add_all([m1, m2, m3])

    cm1 = CardMerchant(
        card_id="VPB_SHOPEE", merchant_id="SHOPEE", relationship_type="co_branded",
        benefit_type="discount", benefit_value=100000.0, benefit_unit="vnd", minimum_spend=0
    )
    cm2 = CardMerchant(
        card_id="TCB_EVERYDAY", merchant_id="PIZZA_4PS", relationship_type="merchant_promotion",
        benefit_type="cashback", benefit_value=10.0, benefit_unit="percent", minimum_spend=0
    )
    db.add_all([cm1, cm2])

    test_user = User(id=1, email="testuser@rightcard.vn", password_hash="secret")
    db.add(test_user)
    db.commit()

    db.close()
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
