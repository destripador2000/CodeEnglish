from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.core.database import get_db
from app.models.md_Sayings import Saying as tbl_Saying
from app.schemas.sch_saying import SayingResponse, SayingCreate


router = APIRouter()


# API para crear un Saying
@router.post("/create_saying", response_model=SayingResponse)
async def create_synonym(saying: SayingCreate,
                         conex: AsyncSession = Depends(get_db)):
    try:
        saying_new = tbl_Saying(**saying.model_dump())

        conex.add(saying_new)
        await conex.commit()
        await conex.refresh(saying_new)

        return saying_new

    except IntegrityError:
        await conex.rollback()
        raise HTTPException(status_code=400, detail="Conflicto de datos.")

    except Exception as ex:
        await conex.rollback()
        print(f"Error: {ex}")
        raise HTTPException(status_code=400, detail="Error al registrar")
