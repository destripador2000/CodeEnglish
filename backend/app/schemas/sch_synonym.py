from pydantic import BaseModel, Field
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
    word: str = Field(max_length=30)
    synonym: str = Field(max_length=30)


# Esquema para actualizar
class SynonymUpdate(BaseModel):
    pages_id: Optional[int] = Field(default=None)
    word: Optional[str] = Field(default=None, max_length=30)
    synonym: Optional[str] = Field(default=None, max_length=30)
