from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

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
@router.get("/get_verb")
async def get_verb(conex: AsyncSession = Depends(get_db)):
    try: 
        stmt = await conex.execute(select(tbl_Verb))
        verbs = stmt.scalars().all()

        return verbs

    except Exception as ex:
        await conex.rollback()
        print(f"Error: {ex}")
        raise HTTPException(status_code=400, detail="Verbos no encontrados")

    