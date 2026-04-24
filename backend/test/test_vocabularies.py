# Función test de crear usuario
def test_create_vocabulary(client):

    payload = {
        "pages_id": 1,
        "word": "Deployment",
        "meaning": "Despliegue"
    }

    response = client.post("/router/rt_vocabularies/create_vocabulary", json=payload)

    assert response.status_code == 200

    data = response.json()
    assert data["word"] == "Deployment"
    assert "id" in data
