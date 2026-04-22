from pydantic import BaseModel


# Esquema para response
class CountryResponse(BaseModel):
    id: int
    pages_iD: int
    country: str
    adjective: str
    person: str

    model_dump = {
        "from_attributes": True
    }


# Esquema para crear
class CountryCreate(BaseModel):
    pages_iD: int
    country: str
    adjective: str
    person: str
