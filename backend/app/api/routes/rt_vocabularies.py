from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.future import select
from typing import List

from app.core.database import get_db
from app.models.md_Vocabulary import Vocabulary as tbl_Vocabulary
from app.schemas.sch_vocabulary import VocabularyResponse, VocabularyCreate

router = APIRouter()


# API para crear una palabra de un vocabulario
@router.post("/create_vocabulary", response_model=VocabularyResponse)
async def create_vocabulary(vocabulary: VocabularyCreate,
                            conex: AsyncSession = Depends(get_db)):
    try:
        vocabulary_new = tbl_Vocabulary(**vocabulary.model_dump())

        conex.add(vocabulary_new)
        await conex.commit()
        await conex.refresh(vocabulary_new)

        return vocabulary_new

    except IntegrityError:
        await conex.rollback()
        raise HTTPException(status_code=400, detail="Conflicto de datos.")

    except Exception as ex:
        await conex.rollback()
        print(f"Error: {ex}")
        raise HTTPException(status_code=400, detail="Error al registrar")


# API para obtener vocabularios
@router.get("/vocabulary/{pages_id}", response_model=List[VocabularyResponse])
async def get_vocabulary(pages_id: int, conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Vocabulary).where(tbl_Vocabulary.pages_id == pages_id)
        result = await conex.execute(stmt)
        vocabularies = result.scalars().all()

        if not vocabularies:
            raise HTTPException(status_code=400, detail="Verbos no encontrados")

        return vocabularies

    except Exception as ex:
        print(f"Error: {ex}")
        raise HTTPException(status_code=500, detail="Problemas en la petición")
