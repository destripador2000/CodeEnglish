from pydantic import BaseModel, Field
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
    base_form: str = Field(max_length=25)
    meaning: str = Field(max_length=25)
    present: str = Field(max_length=25)
    simple_past: str = Field(max_length=25)
    present_part: str = Field(max_length=25)
    past_part: str = Field(max_length=25)


# Esquema para actualizar
class VerbUpdate(BaseModel):
    page_id: Optional[int] = Field(default=None)
    base_form: Optional[str] = Field(default=None, max_length=30)
    meaning: Optional[str] = Field(defualt=None, max_length=30)
    present: Optional[str] = Field(default=None, max_length=30)
    simple_past: Optional[str] = Field(default=None, max_length=30)
    present_part: Optional[str] = Field(default=None, max_length=30)
    past_part: Optional[str] = Field(default=None, max_length=30)
