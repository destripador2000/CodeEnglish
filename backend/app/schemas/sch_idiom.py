from pydantic import BaseModel


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
