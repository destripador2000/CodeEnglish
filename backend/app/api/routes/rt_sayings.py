from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from typing import List
from sqlalchemy.future import select

from app.core.database import get_db
from app.models.md_Sayings import Saying as tbl_Saying
from app.schemas.sch_saying import SayingResponse, SayingCreate, SayingUpdate


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


# API para obtener synonym
@router.get("/saying,{pages_id}", response_model=List[SayingResponse])
async def get_saying(pages_id: int, conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Saying).where(tbl_Saying.pages_id == pages_id)
        result = await conex.execute(stmt)
        saying = result.scalars().all()

        if not saying:
            raise HTTPException(status_code=400, detail="Saying no encontrados")

        return saying

    except Exception as ex:
        print(f"Error: {ex}")
        raise HTTPException(status_code=500, detail="Problemas con la petición")


# API para actualizar saying
@router.patch("/update_saying/{id}")
async def update_saying(id: int, saying: SayingUpdate,
                       conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Saying).where(tbl_Saying.id == id)
        result = await conex.execute(stmt)
        upt_saying = result.scalars().first()

        if not upt_saying:
            raise HTTPException(status_code=400, detail="Saying no encontrado")

        upt_data = saying.model_dump(exclude_unset=True)

        for key, value in upt_data.items():
            setattr(upt_saying, key, value)

        await conex.commit()
        await conex.refresh(upt_saying)

        return upt_saying

    except Exception as ex:
        await conex.rollback()
        print(f"Error: {ex}")
        raise HTTPException(status_code=500, detail="Problemas en la petición")


# API para eliminar saying
@router.delete("/delete_saying/{id}")
async def delete_saying(id: int, conex: AsyncSession = Depends(get_db)):

    try:
        stmt = select(tbl_Saying).where(tbl_Saying.id == id)
        result = await conex.execute(stmt)
        del_saying = result.scalars().first()

        if not del_saying:
            raise HTTPException(status_code=404, detail="Saying no encontrado")

        conex.delete(del_saying)
        await conex.commit()

        return {"mensaje": "Saying eliminado correctamente"}

    except Exception as ex:
        await conex.rollback()
        print(f"Error: {ex}")
        raise HTTPException(status_code=500, detail="Problemas en la petición")
