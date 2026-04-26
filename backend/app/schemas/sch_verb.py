from pydantic import BaseModel
from typing import Optional


# Esquema para Response
class VerbResponse(BaseModel):
    id: int
    page_id: int
    base_form: str
    meaning: str
    present: str
    simple_past: str
    present_part: str
    past_part: str

    model_config = {
       "from_attributes": True
    }


# Esquema para crear verbo
class VerbCreate(BaseModel):
    page_id: int
    base_form: str
    meaning: str
    present: str
    simple_past: str
    present_part: str
    past_part: str


# Esquema para actualizar
class VerbUpdate(BaseModel):
    page_id: Optional[int] = None
    base_form: Optional[str] = None
    meaning: Optional[str] = None
    present: Optional[str] = None
    simple_past: Optional[str] = None
    present_part: Optional[str] = None
    past_part: Optional[str] = None

    model_config = {
       "from_attributes": True
    }
