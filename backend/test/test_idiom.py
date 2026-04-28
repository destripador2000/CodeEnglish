# Función test de ENDPOINT CREATE (Éxitoso)
def test_create_idiom_succes(client):

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


# Función test de ENDPOINT CREATE (Fallido)
def test_create_idiom_fail(client):

    payload = {
        "meaning": "Conocer de vista"
    }

    response = client.post("/router/rt_idioms/create_idiom", json=payload)

    assert response.status_code == 422
    data = response.json()
    assert "detail" in data
    

# Función test de ENDPOINT GET (Éxitoso)
def test_get_idiom_succes(client):

    id_page_test = 5
    payload = {
        "pages_id": id_page_test,
        "phrase": "(To) Know by sight",
        "meaning": "Conocer de vista",
        "example": "I know him by sight"
    }

    client.post("/router/rt_idioms/create_idiom", json=payload)
    response = client.get(f"/router/rt_idioms/idiom/{id_page_test}")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

    assert len(data) == 1
    assert data[0]["phrase"] == "(To) Know by sight"
    assert data[0]["pages_id"] == 5


# Función test para ENDPOINT GET (fallido)
def test_get_idiom_fail(client):

    response = client.get(f"/router/rt_idioms/idiom/99")
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Idiom no encontrado"


# Función test para ENDPOINT PATCH (Éxitoso)
def test_patch_idiom_succes(client):
    payload = {
        "pages_id": 1,
        "phrase": "(To) Know someone by sight",
        "meaning": "Conocer de vista",
        "example": "I know him by sight"
    }

    post = client.post("/router/rt_idioms/create_idiom", json=payload)
    id_created = post.json()["id"]

    payload_patch = {
        "example": "I know her by sight"
    }

    patch = client.patch(f"/router/rt_idioms/update_idiom/{id_created}", json=payload_patch)

    assert patch.status_code == 200
    data =  patch.json()
    assert data["example"] == "I know her by sight"
    assert data["phrase"] == "(To) Know someone by sight"


# Función test para ENDPOINT PATCH (Fallido)
def test_patch_idiom_fail(client):
    
    payload_patch = {
        "example": "I know her by sight"
    }

    response = client.patch("/router/rt_idioms/update_idiom/99", json=payload_patch)
    assert response.status_code == 400
    assert response.json()["detail"] == "Idiom no encontrado"


# Función test para ENDPOINT DELETE (Éxitoso)
def test_delete_idiom_success(client):
    payload = {
        "pages_id": 1,
        "phrase": "(To) Know someone by sight",
        "meaning": "Conocer de vista",
        "example": "I know him by sight"
    }
    post = client.post("/router/rt_idioms/create_idiom", json=payload)
    id_created = post.json()["id"]

    delete = client.delete(f"/router/rt_idioms/delete_idiom/{id_created}")

    assert delete.status_code == 200
    assert delete.json()["mensaje"] == "Idiom eliminado correctamente"
    review = client.get(f"/router/rt_idioms/idiom/1")
    assert review.status_code == 400


# Función test para ENDPOINT DELETE (Fallido)
def test_delete_idiom_fail(client):
    response = delete = client.delete(f"/router/rt_idioms/delete_idiom/99")
    assert response.status_code == 404
    assert response.json()["detail"] == "Idiom no encontrado"