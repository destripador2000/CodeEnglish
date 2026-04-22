from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from typing import List
from sqlalchemy.future import select

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


# API para obtener idiom
@router.get("/idiom,{pages_id}", response_model= List[IdiomResponse])
async def get_idiom(pages_id: int, conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Idiom).where(tbl_Idiom.pages_id == pages_id)
        result = await conex.execute(stmt)
        idiom = result.scalars().all()

        if not idiom:
            raise HTTPException(status_code=400, detail="Saying no encontrados")

        return idiom

    except Exception as ex:
        print(f"Error: {ex}")
        raise HTTPException(status_code=500, detail="Problemas con la petición")
