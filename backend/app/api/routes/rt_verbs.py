from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.core.database import get_db
from app.models.md_Verbs import Verb as tbl_Verb
from app.schemas.sch_verb import VerbResponse, VerbCreate


router = APIRouter()


# API para crear una palabra de un vocabulario
@router.post("/create_verb", response_model=VerbResponse)
async def create_verb(verb: VerbCreate,
                      conex: AsyncSession = Depends(get_db)):
    try:
        verb_new = tbl_Verb(**verb.model_dump())

        conex.add(verb_new)
        await conex.commit()
        await conex.refresh(verb_new)

        return verb_new

    except IntegrityError:
        await conex.rollback()
        raise HTTPException(status_code=400, detail="Conflicto de datos.")

    except Exception as ex:
        await conex.rollback()
        print(f"Error: {ex}")
        raise HTTPException(status_code=400, detail="Error al registrar")
