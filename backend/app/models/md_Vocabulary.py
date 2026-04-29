from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from typing import TYPE_CHECKING
from .base import Base

# Comprobamos que no hayan relaciones redundantes
if TYPE_CHECKING:
    from .md_Pages import Page


# Creamos tabla vocabularies para la base de datos
class Vocabulary(Base):
    __tablename__ = "vocabularies"

    id: Mapped[int] = mapped_column(primary_key=True)
    pages_id: Mapped[int] = mapped_column(ForeignKey("pages.id"))
    word: Mapped[str] = mapped_column(String(30))
    meaning: Mapped[str] = mapped_column(String(35))
    page: Mapped["Page"] = relationship(back_populates="vocabularies")
