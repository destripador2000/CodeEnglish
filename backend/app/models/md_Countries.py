from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from .base import Base

# Verificamos que no hayan relaciones redundantes
if TYPE_CHECKING:
    from .md_Pages import Page


# Creamos tabla countries para base de datos
class Country(Base):
    __tablename__ = "countries"
    id: Mapped[int] = mapped_column(primary_key=True)
    pages_id: Mapped[int] = mapped_column(ForeignKey("pages.id"))
    country: Mapped[str] = mapped_column(String(30), index=True, nullable=False)
    adjective: Mapped[str] = mapped_column(String(30), nullable=False)
    person: Mapped[str] = mapped_column(String(30), nullable=False)
    page: Mapped["Page"] = relationship(back_populates="countries")
