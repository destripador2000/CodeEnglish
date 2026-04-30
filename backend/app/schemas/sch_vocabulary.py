from pydantic import BaseModel, Field
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
    word: str = Field(max_length=30)
    meaning: str = Field(max_length=35)


# Esquema para actualizar
class VocabularyUpdate(BaseModel):
    pages_id: Optional[int] = Field(default=None)
    word: Optional[str] = Field(default=None, max_length=30)
    meaning: Optional[str] = Field(default=None, max_length=35)
