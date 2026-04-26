from pydantic import BaseModel
from typing import Optional


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


# Esquema para actualizar
class VocabularyUpdate(BaseModel):
    pages_id: Optional[int] = None
    word: Optional[str] = None
    meaning: Optional[str] = None

    model_config = {
        "from_attributes": True
    }
