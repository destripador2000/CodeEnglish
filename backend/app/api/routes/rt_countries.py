from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from typing import List
from sqlalchemy.future import select

from app.core.database import get_db
from app.models.md_Countries import Country as tbl_Country
from app.schemas.sch_country import CountryCreate, CountryResponse


router = APIRouter()


# API para crear una palabra de un country
@router.post("/create_country", response_model=CountryResponse)
async def create_country(country: CountryCreate,
                       conex: AsyncSession = Depends(get_db)):
    try:
        country_new = tbl_Country(**country.model_dump())

        conex.add(country_new)
        await conex.commit()
        await conex.refresh(country_new)

        return country_new

    except IntegrityError:
        await conex.rollback()
        raise HTTPException(status_code=400, detail="Conflicto de datos.")

    except Exception as ex:
        await conex.rollback()
        print(f"Error: {ex}")
        raise HTTPException(status_code=400, detail="Error al registrar")


# API para obtener country
@router.get("/country,{pages_id}", response_model= List[CountryResponse])
async def get_idiom(pages_iD: int, conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Country).where(tbl_Country.pages_iD == pages_iD)
        result = await conex.execute(stmt)
        country = result.scalars().all()

        if not country:
            raise HTTPException(status_code=400, detail="Saying no encontrados")

        return country

    except Exception as ex:
        print(f"Error: {ex}")
        raise HTTPException(status_code=500, detail="Problemas con la petición")
