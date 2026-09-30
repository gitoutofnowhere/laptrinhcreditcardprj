def test_wallet_crud_and_optimization(client):
    # 1. Add card to wallet
    res_add = client.post("/api/wallet/cards", json={"card_id": "TCB_EVERYDAY"})
    assert res_add.status_code == 201
    assert res_add.json()["card_id"] == "TCB_EVERYDAY"

    # Add second card
    client.post("/api/wallet/cards", json={"card_id": "VPB_STEPUP"})

    # 2. Get wallet
    res_get = client.get("/api/wallet")
    assert res_get.status_code == 200
    assert len(res_get.json()) == 2

    # 3. Update spending profile
    spending_payload = {
        "items": [
            {"category": "Dining", "monthly_amount": 3000000},
            {"category": "Online", "monthly_amount": 5000000},
            {"category": "Travel", "monthly_amount": 1000000}
        ]
    }
    res_spend = client.put("/api/spending-profile", json=spending_payload)
    assert res_spend.status_code == 200
    assert res_spend.json()["total_monthly_spending"] == 9000000

    # 4. Run Wallet Optimization
    res_opt = client.post("/api/wallet/optimize")
    assert res_opt.status_code == 200
    opt_data = res_opt.json()
    assert opt_data["total_monthly_spending"] == 9000000
    assert len(opt_data["category_recommendations"]) == 3
    # Travel should be marked as weak category
    assert any(w["category"] == "Travel" for w in opt_data["weak_categories"])

    # 5. Remove card from wallet
    res_del = client.delete("/api/wallet/cards/TCB_EVERYDAY")
    assert res_del.status_code == 200

    res_get_after = client.get("/api/wallet")
    assert len(res_get_after.json()) == 1
