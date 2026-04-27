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

# Función test de crear verbo (Fallido)
def test_create_verb_datos_incompletos(client):
    payload = {
        "base_form": "Incompleto",
    }

    response = client.post("/router/rt_verbs/create_verb", json=payload)

    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


# Función test para GET (Éxitoso)
def test_get_verb_succes(client):

    id_pagina_prueba = 5
    payload = {
        "page_id": id_pagina_prueba,
        "base_form": "Buy",
        "meaning": "Comprar",
        "present": "Buys",
        "simple_past": "Bought",
        "present_part": "Buying",
        "past_part": "Bought"
    }
    client.post("/router/rt_verbs/create_verb", json=payload)

    response = client.get(f"/router/rt_verbs/verbs/{id_pagina_prueba}")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

    assert len(data) == 1
    assert data[0]["base_form"] == "Buy"
    assert data[0]["page_id"] == 5
