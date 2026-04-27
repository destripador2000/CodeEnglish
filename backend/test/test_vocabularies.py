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


# Función para test GET (Éxitoso)
def test_get_vocabulary_exitoso(client):

    id_pagina_prueba = 5
    payload = {
        "pages_id": id_pagina_prueba,
        "word": "Testing",
        "meaning": "Pruebas"
    }
    client.post("/router/rt_vocabularies/create_vocabulary", json=payload)

    response = client.get(f"/router/rt_vocabularies/vocabulary/{id_pagina_prueba}")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

    assert len(data) == 1
    assert data[0]["word"] == "Testing"
    assert data[0]["pages_id"] == 5
