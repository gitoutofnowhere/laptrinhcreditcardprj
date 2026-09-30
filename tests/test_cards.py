def test_get_cards(client):
    response = client.get("/api/cards")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 4

def test_get_cards_filter_by_bank(client):
    response = client.get("/api/cards?bank_id=VPB")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert all(c["bank_id"] == "VPB" for c in data)

def test_get_card_detail(client):
    response = client.get("/api/cards/VPB_STEPUP")
    assert response.status_code == 200
    data = response.json()
    assert data["card_id"] == "VPB_STEPUP"
    assert data["name"] == "VPBank StepUp"
    assert len(data["benefits"]) >= 1

def test_compare_cards(client):
    payload = {
        "card_ids": ["VPB_STEPUP", "TCB_EVERYDAY"]
    }
    response = client.post("/api/cards/compare", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "compared_cards" in data
    assert len(data["compared_cards"]) == 2

def test_get_merchants_and_categories(client):
    res_m = client.get("/api/merchants")
    assert res_m.status_code == 200
    assert len(res_m.json()) >= 3

    res_c = client.get("/api/merchants/categories")
    assert res_c.status_code == 200
    assert "categories" in res_c.json()
