from pydantic import BaseModel, Field
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
    saying: str = Field(max_length=45)
    meaning: str = Field(max_length=255)
    example: str = Field(max_length=255)


# Esquema para actualizar
class SayingUpdate(BaseModel):
    pages_id: Optional[int] = Field(default=None)
    saying: Optional[str] = Field(max_length=45)
    meaning: Optional[str] = Field(max_length=255)
    example: Optional[str] = Field(max_length=255)
