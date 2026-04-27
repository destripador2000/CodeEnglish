# Función test para crear un verbo (Éxitoso)
def test_create_ver(client):
    payload = {
        "page_id": 1,
        "base_form": "Buy",
        "meaning": "Comprar",
        "present": "Buys",
        "simple_past": "Bought",
        "present_part": "Buying",
        "past_part": "Bought"
    }

    response = client.post("/router/rt_verbs/create_verb", json=payload)

    assert response.status_code == 200

    data = response.json()
    assert data["base_form"] == "Buy"
    assert "id" in data
