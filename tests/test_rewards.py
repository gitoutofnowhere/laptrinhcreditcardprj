def test_reward_calculator_and_simulation(client):
    # 1. Test Reward Calculation Endpoint
    payload_reward = {
        "card_id": "VPB_STEPUP",
        "category": "Online",
        "amount": 2000000
    }
    res_reward = client.post("/api/rewards/calculate", json=payload_reward)
    assert res_reward.status_code == 200
    data_r = res_reward.json()
    assert data_r["card_id"] == "VPB_STEPUP"
    # 15% of 2M = 300k
    assert data_r["estimated_reward_value"] == 300000.0

    # 2. Add base wallet card and spending
    client.post("/api/wallet/cards", json={"card_id": "TCB_EVERYDAY"})
    client.put("/api/spending-profile", json={
        "items": [
            {"category": "Online", "monthly_amount": 5000000}
        ]
    })

    # 3. Test What-If Simulation Endpoint
    sim_payload = {
        "new_card_id": "VPB_STEPUP"
    }
    res_sim = client.post("/api/wallet/simulate", json=sim_payload)
    assert res_sim.status_code == 200
    sim_data = res_sim.json()
    assert sim_data["new_card_id"] == "VPB_STEPUP"
    assert sim_data["annual_difference"] > 0
    assert len(sim_data["improved_categories"]) == 1
    assert sim_data["improved_categories"][0]["category"] == "Online"
