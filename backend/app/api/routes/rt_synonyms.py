from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.future import select
from typing import List

from app.core.database import get_db
from app.models.md_Synonyms import Synonym as tbl_Synonym
from app.schemas.sch_synonym import SynonymResponse, SynonymCreate, SynonymUpdate


router = APIRouter()


# API para crear una palabra de un synonym
@router.post("/create_synonym", response_model=SynonymResponse)
async def create_synonym(synonym: SynonymCreate,
                         conex: AsyncSession = Depends(get_db)):
    try:
        synonym_new = tbl_Synonym(**synonym.model_dump())

        conex.add(synonym_new)
        await conex.commit()
        await conex.refresh(synonym_new)

        return synonym_new

    except IntegrityError:
        await conex.rollback()
        raise HTTPException(status_code=400, detail="Conflicto de datos.")

    except Exception as ex:
        await conex.rollback()
        print(f"Error: {ex}")
        raise HTTPException(status_code=400, detail="Error al registrar")


# API para obtener synonym
@router.get("/synonyms/{pages_id}", response_model=List[SynonymResponse])
async def get_synonym(pages_id: int, conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Synonym).where(tbl_Synonym.pages_id == pages_id)
        result = await conex.execute(stmt)
        synonyms = result.scalars().all()

    except Exception as ex:
        print(f"Error: {ex}")
        raise HTTPException(status_code=500, detail="Problemas con la peticion")
        
    if not synonyms:
        raise HTTPException(status_code=404, detail="Synonym no encontrados")

    return synonyms


# API para actualizar synonym
@router.patch("/update_synonym/{id}")
async def update_synonym(id: int, synonym: SynonymUpdate,
                         conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Synonym).where(tbl_Synonym.id == id)
        result = await conex.execute(stmt)
        upt_synonym = result.scalars().first()

        if not upt_synonym:
            raise HTTPException(status_code=404, detail="Synonym no encontrado")

        upt_data = synonym.model_dump(exclude_unset=True)

        for key, value in upt_data.items():
            setattr(upt_synonym, key, value)

        await conex.commit()
        await conex.refresh(upt_synonym)

        return upt_synonym

    except Exception as ex:
        await conex.rollback()
        print(f"Error: {ex}")
        raise HTTPException(status_code=500, detail="Problemas en la petición")


# API para eliminar synonym
@router.delete("/delete_synonym/{id}")
async def delete_synonym(id: int, conex: AsyncSession = Depends(get_db)):

    try:
        stmt = select(tbl_Synonym).where(tbl_Synonym.id == id)
        result = await conex.execute(stmt)
        del_synonym = result.scalars().first()

        if not del_synonym:
            raise HTTPException(status_code=404, detail="Synonym no encontrado")

        conex.delete(del_synonym)
        await conex.commit()

        return {"mensaje": "Synonym eliminado correctamente"}

    except Exception as ex:
        await conex.rollback()
        print(f"Error: {ex}")
        raise HTTPException(status_code=500, detail="Problemas en la petición")
