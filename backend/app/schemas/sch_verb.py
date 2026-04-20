from pydantic import BaseModel


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


# Esquema para crear verbo
class VerbCreate(BaseModel):
    page_id: int
    base_form: str
    meaning: str
    present: str
    simple_past: str
    present_part: str
    past_part: str
