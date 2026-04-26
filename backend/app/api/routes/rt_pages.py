from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.models.md_Pages import Page as tblPage
from app.schemas.sch_page import PageResponse, PageCreate, PageUpdate

router = APIRouter()


# API para crear página
@router.post("/create_page", response_model=PageResponse)
async def create_page(page: PageCreate,
                      conex: AsyncSession = Depends(get_db)):
    try:
        page_new = tblPage(**page.model_dump())

        conex.add(page_new)
        await conex.commit()
        await conex.refresh(page_new)
        return page_new

    except Exception as ex:
        await conex.rollback()
        print(f"Error:{ex}")
        raise HTTPException(status_code=400, detail="Error al registrar")


# API para actualizar página
@router.patch("/update_page/{id}")
async def update_page(id: int, page: PageUpdate,
                     conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tblPage).where(tblPage.id == id)
        result = await conex.execute(stmt)
        upt_page = result.scalars().first()

        if not upt_page:
            raise HTTPException(status_code=400, detail="Página no encontrada")

        upt_data = page.model_dump(exclude_unset=True)

        for key, value in upt_data.items():
            setattr(upt_page, key, value)

        await conex.commit()
        await conex.refresh(upt_page)

        return upt_page

    except Exception as ex:
        await conex.rollback()
        print(f"Error: {ex}")
        raise HTTPException(status_code=500, detail="Problemas en la petición")
