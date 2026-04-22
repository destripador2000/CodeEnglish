from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

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

