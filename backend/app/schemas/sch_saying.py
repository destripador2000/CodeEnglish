from pydantic import BaseModel
from typing import Optional


# Esquema para reponse
class SayingResponse(BaseModel):
    id: int
    pages_id: int
    saying: str
    meaning: str
    example: str

    model_config = {
        "from_attributes": True
    }


# Esquema para crear
class SayingCreate(BaseModel):
    pages_id: int
    saying: str
    meaning: str
    example: str


# Esquema para actualizar
class SayingUpdate(BaseModel):
    pages_id: Optional[int] = None
    saying: Optional[str] = None
    meaning: Optional[str] = None
    example: Optional[str] = None

    model_config = {
        "from_attributes": True
    }
