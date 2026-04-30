from pydantic import BaseModel, Field
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
    phrase: str = Field(max_length=30)
    meaning: str = Field(max_length=255)
    example: str = Field(max_length=255)


# Esquema para actualizar
class IdiomUpdate(BaseModel):
    pages_id: Optional[int] = Field(default=None)
    phrase: Optional[str] = Field(default=None, max_length=30)
    meaning: Optional[str] = Field(default=None, max_length=255)
    example: Optional[str] = Field(default=None, max_length=255)
