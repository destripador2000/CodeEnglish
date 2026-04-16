from pydantic import BaseModel


# Esquema de respuesta
class PageResponse(BaseModel):
    id: int
    page_number: int
    module_type: str
    subtitle: str

    model_config = {
       "from_attributes": True
    }


# Esquema para crear página
class PageCreate(BaseModel):
    page_number: int
    module_type: str
    subtitle: str
