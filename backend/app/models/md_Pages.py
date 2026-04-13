from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, TYPE_CHECKING
from .base import Base


# Comprobamos si no hay relaciones redundantes
if TYPE_CHECKING:
    from .md_Countries import Country
    from .md_Idioms import Idiom
    from .md_Sayings import Saying
    from .md_Synonyms import Synonym
    from .md_Verbs import Verb
    from .md_Vocabulary import Vocabulary


# Creación de la tabla pages
class Page(Base):
    __tablename__ = "pages"

    id: Mapped[int] = mapped_column(primary_key=True)
    page_number: Mapped[int] = mapped_column(nullable=False, index=True)
    module_type: Mapped[str] = mapped_column(nullable=False)
    subtitle: Mapped[str] = mapped_column(nullable=False)

    countries: Mapped[List["Country"]] = relationship(back_populates="page", cascade="all, delete-orphan")
    idioms: Mapped[List["Idiom"]] = relationship(back_populates="page", cascade="all, delete-orphan")
    sayings: Mapped[List["Saying"]] = relationship(back_populates="page", cascade="all, delete-orphan")
    synonyms: Mapped[List["Synonym"]] = relationship(back_populates="page", cascade="all, delete-orphan")
    verbs: Mapped[List["Verb"]] = relationship(back_populates="page", cascade="all, delete-orphan")
    vocabularies: Mapped[List["Vocabulary"]] = relationship(back_populates="page", cascade="all, delete-orphan")
