# Función test de crear usuario (Éxitoso)
def test_create_vocabulary_succes(client):

    payload = {
        "pages_id": 1,
        "word": "Deployment",
        "meaning": "Despliegue"
    }

    response = client.post("/api/rt_vocabularies/create_vocabulary", json=payload)

    assert response.status_code == 200

    data = response.json()
    assert data["word"] == "Deployment"
    assert "id" in data


# Función test de crear usuario (Error)
def test_create_vocabulary_fail(client):

    payload_incompleto = {
        "word": "Incompleto"
    }

    response = client.post("/api/rt_vocabularies/create_vocabulary", json=payload_incompleto)

    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


# Función test para GET (Éxitoso)
def test_get_vocabulary_succes(client):

    id_pagina_prueba = 5
    payload = {
        "pages_id": id_pagina_prueba,
        "word": "Testing",
        "meaning": "Pruebas"
    }
    client.post("/api/rt_vocabularies/create_vocabulary", json=payload)

    response = client.get(f"/api/rt_vocabularies/vocabulary/{id_pagina_prueba}")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

    assert len(data) == 1
    assert data[0]["word"] == "Testing"
    assert data[0]["pages_id"] == 5


# Función test para GET (Fallido)
def test_get_vocabulary_fail(client):

    response = client.get("/api/rt_vocabularies/vocabulary/99")

    assert response.status_code == 404
    assert response.json()["detail"] == "Verbos no encontrados"


# Función test para PATCH (Éxitoso)
def test_update_vocabulary_success(client):

    payload_crear = {
        "pages_id": 1,
        "word": "Bug",
        "meaning": "Bicho"
    }
    response_post = client.post("/api/rt_vocabularies/create_vocabulary", json=payload_crear)
    id_creado = response_post.json()["id"]

    payload_patch = {
        "meaning": "Error de software"
    }
    response_patch = client.patch(f"/api/rt_vocabularies/update_vocabulary/{id_creado}", json=payload_patch)

    assert response_patch.status_code == 200
    data = response_patch.json()

    assert data["meaning"] == "Error de software"
    assert data["word"] == "Bug"


# Función test para ENPOINT PATCH (Fallido)
def test_update_vocabulary_fail(client):

    payload_patch = {"word": "Fantasma"}

    response = client.patch("/api/rt_vocabularies/update_vocabulary/999", json=payload_patch)

    assert response.status_code == 404
    assert response.json()["detail"] == "Vocabulario no encontrado"


# Función test para ENDPOINT DELETE (éxitoso)
def test_delete_vocabulary_success(client):

    payload_crear = {
        "pages_id": 1,
        "word": "DeleteMe",
        "meaning": "Bórrame"
    }
    response_post = client.post("/api/rt_vocabularies/create_vocabulary", json=payload_crear)
    id_creado = response_post.json()["id"]

    response_delete = client.delete(f"/api/rt_vocabularies/delete_vocabulary/{id_creado}")

    assert response_delete.status_code == 200
    assert response_delete.json()["mensaje"] == "Vocabulario eliminado correctamente"

    response_verificar = client.get("/api/rt_vocabularies/vocabulary/1")
    assert response_verificar.status_code == 404


# Función test para ENDPOINT DELETE (fallido)
def test_delete_vocabulary_fail(client):

    response = client.delete("/api/rt_vocabularies/delete_vocabulary/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Vocabulario no encontrado"
