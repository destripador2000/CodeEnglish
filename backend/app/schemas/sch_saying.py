from pydantic import BaseModel


# Esquema para reponse
class SayingResponse(BaseModel):
    id: int
    pages_ig: int
    saying: str
    meaning: str
    example: str

    model_config = {
        "from_attributes": True
    }


# Esquema para crear
class SayingCreate(BaseModel):
    pages_ig: int
    saying: str
    meaning: str
    example: str
