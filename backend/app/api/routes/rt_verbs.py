from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from typing import List

from app.core.database import get_db
from app.models.md_Verbs import Verb as tbl_Verb
from app.schemas.sch_verb import VerbResponse, VerbCreate
from sqlalchemy.future import select


router = APIRouter()


# API para crear un verbo
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


# API para obtener verbos
@router.get("/verbs/{page_id}", response_model=List[VerbResponse])
async def get_verb(page_id: int, conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Verb).where(tbl_Verb.page_id == page_id)
        result = await conex.execute(stmt)
        verbs = result.scalars().all()

        if not verbs:
            raise HTTPException(status_code=400, detail="Verbos no encontrados")

        return verbs

    except Exception as ex:
        print(f"Error: {ex}")
        raise HTTPException(status_code=500, detail="Error en la petición")
