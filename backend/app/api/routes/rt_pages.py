from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.md_Pages import Page as tblPage
from app.schemas.sch_page import PageResponse, PageCreate

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
