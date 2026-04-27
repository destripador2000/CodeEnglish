# Función test de crear usuario (Éxitoso)
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


# Función test de crear usuario (Error)
def test_create_vocabulary_datos_incompletos(client):

    payload_incompleto = {
        "word": "Incompleto"
    }

    response = client.post("/router/rt_vocabularies/create_vocabulary", json=payload_incompleto)

    assert response.status_code == 422
    data = response.json()
    assert "detail" in data
