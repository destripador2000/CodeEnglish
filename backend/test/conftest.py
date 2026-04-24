import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker


from app.main import app
from app.core.database import get_db, Base
from app.core.config import settings

# URL de base de datos
SQLALCHEMY_DATABASE_URL = settings.database_ram_url

# Creamos el engine para la base de datos en la RAM
engine_test = create_async_engine(
        SQLALCHEMY_DATABASE_URL,
        echo=False)

# Fabrica de sesiones asíncronas
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine_test,
    class_=AsyncSession
)


# Función para crear base de datos
@pytest.fixture(autouse=True)
async def setup_database():
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield

    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


# Función para sesión de base de datos para el override
async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session


# Función que usa el client para testears
@pytest.fixture
def client():
    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client
