from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from typing import List

from app.core.database import get_db
from app.models.md_Verbs import Verb as tbl_Verb
from app.schemas.sch_verb import VerbResponse, VerbCreate, VerbUpdate
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

    except Exception as ex:
        print(f"Error: {ex}")
        raise HTTPException(status_code=500, detail="Error en la petición")

    if not verbs:
        raise HTTPException(status_code=404, detail="Verbos no encontrados")

    return verbs


# API para actualizar verbo
@router.patch("/update_verb/{id}")
async def update_verb(id: int, verb: VerbUpdate,
                      conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Verb).where(tbl_Verb.id == id)
        result = await conex.execute(stmt)
        upt_verb = result.scalars().first()

    except Exception as ex:
        print(f"Error de lectura: {ex}")
        raise HTTPException(status_code=500, detail="Problemas con la petición")

    if not upt_verb:
        raise HTTPException(status_code=404, detail="Verbo no encontrado")

    try:
        upt_data = verb.model_dump(exclude_unset=True)

        for key, value in upt_data.items():
            setattr(upt_verb, key, value)

        await conex.commit()
        await conex.refresh(upt_verb)

        return upt_verb

    except Exception as ex:
        await conex.rollback()
        print(f"Error: {ex}")
        raise HTTPException(status_code=500, detail="Problemas en la petición")


# API para eliminar verbo
@router.delete("/delete_verb/{id}")
async def delete_verb(id: int, conex: AsyncSession = Depends(get_db)):

    try:
        stmt = select(tbl_Verb).where(tbl_Verb.id == id)
        result = await conex.execute(stmt)
        del_verb = result.scalars().first()

    except Exception as ex:
        print(f"Error: {ex}")
        raise HTTPException(status_code=500, detail="Problemas en la petición")

    if not del_verb:
        raise HTTPException(status_code=404, detail="Verbo no encontrado")

    try:
        await conex.delete(del_verb)
        await conex.commit()

        return {"mensaje": "Verbo eliminado correctamente"}

    except Exception as ex:
        await conex.rollback()
        print(f"Error: {ex}")
        raise HTTPException(status_code=500, detail="Problemas en la petición")
