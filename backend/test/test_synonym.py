# Función test para crear un synonym (Éxitoso)
def test_create_synonym(client):
    payload={
        "pages_id": 1,
        "word": "Test",
        "synonym": "Quiz"
    }

    response = client.post("/api/rt_synonyms/create_synonym", json=payload)

    assert response.status_code == 200

    data = response.json()
    assert data["word"] == "Test"
    assert "id" in data