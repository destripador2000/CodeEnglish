# Backend Development Style Guide

## Stack Tecnológico Core

- **Web Framework**: FastAPI con CORS habilitado
- **ORM**: SQLAlchemy 2.0+ con soporte asíncrono (`create_async_engine`, `async_sessionmaker`)
- **Schemas**: Pydantic v2 (`BaseModel` con `model_config = {"from_attributes": True}`)
- **Configuración**: Pydantic Settings con `BaseSettings` y `SettingsConfigDict`
- **Migraciones**: Alembic
- **Base de Datos**: PostgreSQL (production), SQLite en RAM con aiosqlite (testing)
- **Testing**: pytest + pytest-asyncio + TestClient
- **Type Hinting**: Python typing completo con `Mapped[]`, `mapped_column`

---

## Arquitectura y Estructura de Proyecto

```
backend/
├── app/
│   ├── main.py                      # FastAPI app, incluye routers
│   ├── core/
│   │   ├── config.py                # Settings via pydantic-settings
│   │   └── database.py             # Async engine + get_db dependency
│   ├── api/
│   │   └── routes/
│   │       ├── rt_verbs.py         # Prefijo rt_ para rutas
│   │       ├── rt_vocabularies.py
│   │       └── ...
│   ├── models/
│   │   ├── base.py                 # DeclarativeBase
│   │   ├── md_Verbs.py             # Prefijo md_ para modelos
│   │   ├── md_Vocabulary.py
│   │   └── ...
│   └── schemas/
│       ├── sch_verb.py             # Prefijo sch_ para schemas
│       ├── sch_vocabulary.py
│       └── ...
├── test/
│   ├── conftest.py                 # Fixtures de testing (BD en RAM)
│   ├── test_verb.py
│   └── pytest.ini
└── alembic/                       # Migraciones
```

---

## Patrones de Diseño y Flujo de Datos

### Inyección de Dependencias y Base de Datos

- Usa `Depends(get_db)` para obtener sesión async
- Nombre de variable de conexión: `conex` (no `db`, no `session`)
- Siempre usa engine asíncrono: `create_async_engine` + `async_sessionmaker`

```python
# database.py
engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)
SessionLocal = async_sessionmaker(bind=engine, ..., class_=AsyncSession)

async def get_db():
    async with SessionLocal() as session:
        yield session
```

```python
# En rutas
async def endpoint(entidad: EntityCreate, conex: AsyncSession = Depends(get_db)):
```

### Queries Asíncronas

- Usa `select()` desde `sqlalchemy.future` (no `select` de sqlalchemy.orm)
- Ejecuta con `await conex.execute(stmt)`
- Extrae resultados con `.scalars().all()` o `.scalars().first()`

```python
stmt = select(tbl_Entity).where(tbl_Entity.campo == valor)
result = await conex.execute(stmt)
entities = result.scalars().all()
```

### Patrón CRUD en Rutas

1. **CREATE**: `conex.add(obj)`, `await conex.commit()`, `await conex.refresh(obj)`
2. **READ**: `select(...).where(...)`
3. **UPDATE**: SELECT primero, luego `model_dump(exclude_unset=True)`, iterar con `setattr`
4. **DELETE**: SELECT primero, luego `await conex.delete(obj)`, `await conex.commit()`

```python
# Create
new_obj = tbl_Entity(**data.model_dump())
conex.add(new_obj)
await conex.commit()
await conex.refresh(new_obj)

# Update
upt_data = data.model_dump(exclude_unset=True)
for key, value in upt_data.items():
    setattr(upt_obj, key, value)
await conex.commit()
await conex.refresh(upt_obj)

# Delete
await conex.delete(found_obj)
await conex.commit()
```

### Import de Modelos en Rutas

- Alias con prefijo `tbl_`: `from app.models.md_Verbs import Verb as tbl_Verb`

```python
from app.models.md_Verbs import Verb as tbl_Verb
from app.schemas.sch_verb import VerbResponse, VerbCreate, VerbUpdate
```

---

## Convenciones de Nombrado y Tipado

### Archivos

| Tipo | Prefijo | Ejemplo |
|------|--------|---------|
| Rutas | `rt_` | `rt_verbs.py`, `rt_vocabularies.py` |
| Modelos | `md_` | `md_Verbs.py`, `md_Vocabulary.py` |
| Schemas | `sch_` | `sch_verb.py`, `sch_vocabulary.py` |

### Modelos SQLAlchemy

- Heredan de `Base` (DeclarativeBase)
- `__tablename__` en minúsculas plural
- Uso strict de `Mapped[]` y `mapped_column()`
- Relaciones con `relationship(back_populates=)`

```python
class Verb(Base):
    __tablename__ = "verbs"
    id: Mapped[int] = mapped_column(primary_key=True)
    page_id: Mapped[int] = mapped_column(ForeignKey("pages.id"))
    base_form: Mapped[str] = mapped_column(String(25), index=True, nullable=False)
    page: Mapped["Page"] = relationship(back_populates="verbs")
```

### Relaciones y TYPE_CHECKING

- Usa `TYPE_CHECKING` para evitar imports circulares

```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .md_Pages import Page
```

### Schemas Pydantic

- Nombres de clases: `{Entity}Response`, `{Entity}Create`, `{Entity}Update`
- Response usa `model_config = {"from_attributes": True}` para conversión desde ORM
- Update usa `Optional[]` con default `None` para campos opcionales

```python
class VerbResponse(BaseModel):
    id: int
    base_form: str
    model_config = {"from_attributes": True}

class VerbCreate(BaseModel):
    base_form: str
    meaning: str

class VerbUpdate(BaseModel):
    base_form: Optional[str] = None
    meaning: Optional[str] = None
    model_config = {"from_attributes": True}
```

### Variables

- Usa nombres descriptivos en español o inglés consistente
- Conexión siempre: `conex`
- Instancias de modelo: `verb_new`, `upt_verb`, `del_verb`
- Schemas: `verb`, `verb_create`, `verb_update`

---

## Manejo de Errores y Validaciones

### Validación de Entrada

- CONFÍA en Pydantic: los schemas Validan automáticamente (status 422 si falla)
- No valides manualmente campos requeridos

### Estructura de Manejo de Errores

```python
@router.post("/endpoint")
async def create_endpoint(entidad: EntityCreate, conex: AsyncSession = Depends(get_db)):
    try:
        # Lógica principal
        nuevo = tbl_Entity(**entidad.model_dump())
        conex.add(nuevo)
        await conex.commit()
        await conex.refresh(nuevo)
        return nuevo

    except IntegrityError:
        await conex.rollback()
        raise HTTPException(status_code=400, detail="Conflicto de datos.")

    except Exception as ex:
        await conex.rollback()
        print(f"Error: {ex}")  # Loguea para debugging
        raise HTTPException(status_code=400, detail="Error al registrar")
```

### Códigos de Estado HTTP

| Código | Uso |
|--------|-----|
| 200 | Éxito |
| 400 | Error de validación de negocio, datos inválidos |
| 404 | Recurso no encontrado |
| 422 | Validación de Pydantic fallida |
| 500 | Error inesperado de servidor |

### Errores en GET

```python
if not entities:
    raise HTTPException(status_code=400, detail="Entidades no encontradas")
```

---

## Estrategia de Testing

### Estructura en test/

- `conftest.py`: fixtures globales/engine de test
- `test_{entity}.py`: tests por entidad
- `__init__.py`: puede estar vacío o no existir

### Configuración de Base de Datos de Test

```python
# conftest.py
SQLALCHEMY_DATABASE_URL = settings.database_ram_url  # aiosqlite en RAM
engine_test = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=False)
TestingSessionLocal = sessionmaker(bind=engine_test, class_=AsyncSession)

@pytest.fixture(autouse=True)
async def setup_database():
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
```

### Fixture de Client

```python
@pytest.fixture
def client():
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
```

### Patrones de Test

- Tests de éxito: crear primero, luego verificar
- Tests de fracaso: verificar mensaje en `response.json()["detail"]`
- Assertions: status codes (200, 400, 404, etc.) + contenido JSON

```python
def test_create_entity(client):
    payload = {"campo": "valor"}
    response = client.post("/router/rt_entity/create_entity", json=payload)
    assert response.status_code == 200
    assert response.json()["campo"] == "valor"

def test_create_entity_fail(client):
    payload = {"campo_incompleto": "valor"}
    response = client.post("/router/rt_entity/create_entity", json=payload)
    assert response.status_code == 422
```

---

## Reglas Imperativas

1. **Siempre separa modelos de schemas**: `app/models/` y `app/schemas/`
2. **Usa sesiones asíncronas**: `AsyncSession`, `await`, `async with`
3. **Nombra archivos de rutas con prefijo rt_**: `rt_verbs.py`, `rt_pages.py`
4. **Nombra archivos de modelos con prefijo md_**: `md_Verbs.py`, `md_Pages.py`
5. **Nombra archivos de schemas con prefijo sch_**: `sch_verb.py`, `sch_page.py`
6. **Importa modelos con alias tbl_**: `from app.models.md_Verbs import Verb as tbl_Verb`
7. **Usa TYPE_CHECKING para relaciones**: evita imports circulares
8. **Usa Pydantic para validación**: no escribas validación manual
9. **Nombre de conexión: conex**: no `db`, no `session`
10. **Todas las funciones async**: rutas y funciones de base de datos
11. **Siempre haz rollback en except**: `await conex.rollback()`
12. **Loguea con print en desarrollo**: `print(f"Error: {ex}")`
13. **Registra rutas con tags**: `tags=["entity"]` en `include_router`
14. **Usa prefijos consistentes**: `/router/rt_entity/` en include_router
15. **Response schemas con model_config**: `{"from_attributes": True}`
16. **Update schemas con Optional[]**: campos opcionales con default None
17. **Fixtures de test con autouse**: para crear/drop tablas automáticamente
18. **Base de datos de test en RAM**: usa aiosqlite, no PostgreSQL
19. **Cascade delete en relaciones**: `cascade="all, delete-orphan"` en relationships
20. **ForeignKey en modelo**: define la clave foránea en el modelo, no en la tabla

---

## Registro de Routers en main.py

```python
app.include_router(router_Verb, prefix="/router/rt_verbs", tags=["verbs"])
```

---

## Convenciones Adicionales

- **comments en español** en código (comentarios de lógica)
- **Módulos externos**: Alembic para migraciones
- **Env vars**: usa `.env` con pydantic-settings
- **CORS**: configura orígenes explícitos, no `["*"]`
- **echo=True** en dev, `echo=False` en producción