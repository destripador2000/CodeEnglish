from pydantic import BaseModel, Field
from typing import Optional


# Esquema para response
class CountryResponse(BaseModel):
    id: int
    pages_id: int
    country: str
    adjective: str
    person: str

    model_config = {
        "from_attributes": True
    }


# Esquema para crear
class CountryCreate(BaseModel):
    pages_id: int
    country: str = Field(max_length=30)
    adjective: str = Field(max_length=30)
    person: str = Field(max_length=30)


# Esquema para actualizar
class CountryUpdate(BaseModel):
    pages_id: Optional[int] = Field(default=None)
    country: Optional[str] = Field(default=None, max_length=30)
    adjective: Optional[str] = Field(default=None, max_length=30)
    person: Optional[str] = Field(default=None, max_length=30)
