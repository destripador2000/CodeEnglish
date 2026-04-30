from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from .base import Base

# Comprobamos que no hayan relaciones redundantes
if TYPE_CHECKING:
    from .md_Pages import Page


# Creamos tabla saying para base de datos
class Saying(Base):
    __tablename__ = "sayings"
    id: Mapped[int] = mapped_column(primary_key=True)
    pages_id: Mapped[int] = mapped_column(ForeignKey("pages.id"))
    saying: Mapped[str] = mapped_column(String(45), index=True, nullable=False)
    meaning: Mapped[str] = mapped_column(String(255), nullable=False)
    example: Mapped[str] = mapped_column(String(255), nullable=False)
    page: Mapped["Page"] = relationship(back_populates="sayings")
