# Función test para crear un synonym (Éxitoso)
def test_create_synonym_succes(client):
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


# Función test para crear synonym (Fallido)
def test_create_synonym_fail(client):
    payload={
        "word": "Test",
    }

    response = client.post("/api/rt_synonyms/create_synonym", json=payload)

    assert response.status_code == 422
    data = response.json()
    assert "detail" in data
 

# Función test para obtener synonym (Éxitoso)
def test_get_synonym_succes(client):
    
    id_test_page = 5
    payload={
        "pages_id": id_test_page,
        "word": "Test",
        "synonym": "Quiz"
    }

    client.post("/api/rt_synonyms/create_synonym", json=payload)
    response = client.get(f"/api/rt_synonyms/synonyms/{id_test_page}")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

    assert len(data) == 1
    assert data[0]["word"] == "Test"
    assert data[0]["pages_id"] == 5
