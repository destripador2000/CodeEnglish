from pydantic import BaseModel
from typing import Optional


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


# Esquema para actualizar
class SynonymUpdate(BaseModel):
    pages_id: Optional[int] = None
    word: Optional[str] = None
    synonym: Optional[str] = None

    model_config = {
       "from_attributes": True
    }
