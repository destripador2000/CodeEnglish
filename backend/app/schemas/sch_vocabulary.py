from pydantic import BaseModel


# Esquema de respuesta
class VocabularyResponse(BaseModel):
    id: int
    pages_id: int
    word: str
    meaning: str

    model_config = {
        "from_attributes": True
    }


# Esquema para crear
class VocabularyCreate(BaseModel):
    pages_id: int
    word: str
    meaning: str
