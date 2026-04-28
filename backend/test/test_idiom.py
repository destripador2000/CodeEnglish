# Función test de ENDPOINT CREATe (Éxitoso)
def test_create_idiom(client):

    payload = {
        "pages_id": 1,
        "phrase": "(To) Know by sight",
        "meaning": "Conocer de vista",
        "example": "I know him by sight"
    }

    response = client.post("/router/rt_idioms/create_idiom", json=payload)

    assert response.status_code == 200

    data = response.json()
    assert data["phrase"] == "(To) Know by sight"
    assert "id" in data