def test_recommendation_mode_find_card_to_open(client):
    payload = {
        "mode": "FIND_CARD_TO_OPEN",
        "monthly_income": 20000000,
        "favorite_merchants": ["SHOPEE", "GRAB"],
        "favorite_categories": ["Online", "E-commerce"],
        "primary_preference": "cashback",
        "secondary_preferences": ["low_fee"],
        "max_annual_fee": 1000000
    }
    response = client.post("/api/recommendation", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "FIND_CARD_TO_OPEN"
    assert "recommended_card" in data
    assert data["recommended_card"]["card_id"] in ["VPB_SHOPEE", "VPB_STEPUP"]
    assert len(data["recommended_card"]["reasons"]) >= 1
    assert "alternatives" in data

def test_recommendation_mode_use_existing_card(client):
    # First add a card to wallet
    client.post("/api/wallet/cards", json={"card_id": "TCB_EVERYDAY"})

    payload = {
        "mode": "USE_EXISTING_CARD",
        "merchant_id": "PIZZA_4PS",
        "category": "Dining",
        "amount": 3000000,
        "primary_preference": "cashback"
    }
    response = client.post("/api/recommendation", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "USE_EXISTING_CARD"
    assert data["recommended_card"]["card_id"] == "TCB_EVERYDAY"
    assert data["recommended_card"]["estimated_value"] is not None
