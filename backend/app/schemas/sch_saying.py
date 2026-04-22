from pydantic import BaseModel


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
