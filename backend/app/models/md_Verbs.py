from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from .base import Base

# Verificamos que no hayan relaciones redundantes
if TYPE_CHECKING:
    from .md_Pages import Page


# Creamos tabla countries para base de datos
class Verb(Base):
    __tablename__ = "verbs"
    id: Mapped[int] = mapped_column(primary_key=True)
    page_id: Mapped[int] = mapped_column(ForeignKey("pages.id"))
    base_form: Mapped[str] = mapped_column(String(25), index=True, nullable=False)
    meaning: Mapped[str] = mapped_column(String(25), nullable=False)
    present: Mapped[str] = mapped_column(String(25), nullable=False)
    simple_past: Mapped[str] = mapped_column(String(25), nullable=False)
    present_part: Mapped[str] = mapped_column(String(25), nullable=False)
    past_part: Mapped[str] = mapped_column(String(25), nullable=False)
    page: Mapped["Page"] = relationship(back_populates="verbs")
