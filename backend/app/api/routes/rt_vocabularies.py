from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

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
