from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from .base import Base

# Verificamos que no hayan relaciones redundantes
if TYPE_CHECKING:
    from .md_Pages import Page


# Creamos tabla idiom para base de datos
class Idiom(Base):
    __tablename__ = "idioms"
    id: Mapped[int] = mapped_column(primary_key=True)
    pages_id: Mapped[int] = mapped_column(ForeignKey("pages.id"))
    phrase: Mapped[str] = mapped_column(String(30), index=True, nullable=False)
    meaning: Mapped[str] = mapped_column(String(255), nullable=False)
    example: Mapped[str] = mapped_column(String(255), nullable=False)
    page: Mapped["Page"] = relationship(back_populates="idioms")
