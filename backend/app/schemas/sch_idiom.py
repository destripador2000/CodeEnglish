from pydantic import BaseModel
from typing import Optional


# Esquema para response
class IdiomResponse(BaseModel):
    id: int
    pages_id: int
    phrase: str
    meaning: str
    example: str

    model_config = {
        "from_attributes": True
    }


# Esquema para crear
class IdiomCreate(BaseModel):
    pages_id: int
    phrase: str
    meaning: str
    example: str


# Esquema para actualizar
class IdiomUpdate(BaseModel):
    pages_id: Optional[int] = None
    phrase: Optional[str] = None
    meaning: Optional[str] = None
    example: Optional[str] = None

    model_config = {
        "from_attributes": True
    }
