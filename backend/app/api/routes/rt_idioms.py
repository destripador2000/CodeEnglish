from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.core.database import get_db
from app.models.md_Idioms import Idiom as tbl_Idiom
from app.schemas.sch_idiom import IdiomResponse, IdiomCreate


router = APIRouter()


# API para crear una palabra de un Idiom
@router.post("/create_idiom", response_model=IdiomResponse)
async def create_idiom(idiom: IdiomCreate,
                       conex: AsyncSession = Depends(get_db)):
    try:
        idiom_new = tbl_Idiom(**idiom.model_dump())

        conex.add(idiom_new)
        await conex.commit()
        await conex.refresh(idiom_new)

        return idiom_new

    except IntegrityError:
        await conex.rollback()
        raise HTTPException(status_code=400, detail="Conflicto de datos.")

    except Exception as ex:
        await conex.rollback()
        print(f"Error: {ex}")
        raise HTTPException(status_code=400, detail="Error al registrar")
