from pydantic import BaseModel
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
    country: str
    adjective: str
    person: str


# Esquema para actualizar
class CountryUpdate(BaseModel):
    pages_id: Optional[int] = None
    country: Optional[str] = None
    adjective: Optional[str] = None
    person: Optional[str] = None

    model_config = {
        "from_attributes": True
    }
