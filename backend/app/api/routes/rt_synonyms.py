from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.core.database import get_db
from app.models.md_Synonyms import Synonym as tbl_Synonym
from app.schemas.sch_synonym import SynonymResponse, SynonymCreate


router = APIRouter()


# API para crear una palabra de un vocabulario
@router.post("/create_synonym", response_model=SynonymResponse)
async def create_synonym(synonym: SynonymCreate,
                         conex: AsyncSession = Depends(get_db)):
    try:
        synonym_new = tbl_Synonym(**synonym.model_dump())

        conex.add(synonym_new)
        await conex.commit()
        await conex.refresh(synonym_new)

        return synonym_new

    except IntegrityError:
        await conex.rollback()
        raise HTTPException(status_code=400, detail="Conflicto de datos.")

    except Exception as ex:
        await conex.rollback()
        print(f"Error: {ex}")
        raise HTTPException(status_code=400, detail="Error al registrar")
