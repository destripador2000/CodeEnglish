from pydantic import BaseModel


# Creando esquema para reponse
class SynonymResponse(BaseModel):
    id: int
    pages_id: int
    word: str
    synonym: str

    model_config = {
       "from_attributes": True
    }


# Creando esquema para crear synonym
class SynonymCreate(BaseModel):
    pages_id: int
    word: str
    synonym: str
