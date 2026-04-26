from pydantic import BaseModel
from typing import Optional


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


# Esquema para actualizar
class PageUpdate(BaseModel):
    page_number: Optional[int] = None
    module_type: Optional[str] = None
    subtitle: Optional[str] = None

    model_config = {
       "from_attributes": True
    }
