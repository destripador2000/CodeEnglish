# Auditoría Técnica de Backend - Informe Completo

---

## 📋 Información General

- **Fecha de Auditoría**: 29 de Abril de 2026
- **Auditor**: OpenCode AI
- **Alcance**: Carpeta `backend/` completa
- **Versión de Python**: 3.13
- **Framework**: FastAPI + SQLAlchemy 2.0

---

# 📊 Evaluación Final (Resumen)

## Lo Bueno

- Uso correcto de **SQLAlchemy 2.0** con tipado estricto (`Mapped[]`, `mapped_column`)
- **Patrón async/await** consistente en todas las rutas
- **Inyección de dependencias** bien implementada con `Depends(get_db)`
- Separación clara de **modelos, schemas y rutas** en carpetas
- **TYPE_CHECKING** para evitar imports circulares
- **Cascade delete** configurado en relaciones
- **Testing fixtures** bien estructurados usando base de datos en RAM
- Uso de **prefijo tbl_** para imports de modelos (consistencia)
- **Schemas Response/Create/Update** bien diferenciados
- Manejo de **IntegrityError** para errores de BD
- **Modelos base** separados correctamente

## Lo Malo (Errores Críticos Priorizados)

| # | Problema | Severidad | Ubicación |
|---|---------|-----------|-----------|
| 1 | Paths con comas (`/resource,{id}`) - ENDPOINTS ROTOS | 🔴 CRÍTICA | rt_synonyms, rt_sayings, rt_countries |
| 2 | `pages_iD` inconsistente vs `page_id`/`pages_id` | 🔴 CRÍTICA | md_Countries, sch_country |
| 3 | Nombre de función `get_idiom` en rt_countries.py | 🔴 ALTA | rt_countries.py:40 |
| 4 | Nombre función `create_synonym` en rt_sayings.py | 🔴 ALTA | rt_sayings.py:17 |
| 5 | `echo=True` en database.py | 🔴 ALTA | database.py:12 |
| 6 | Comentarios incorrectos ("countries" para otras tablas) | 🟡 MEDIA | md_Synonyms, md_Idioms, md_Sayings |
| 7 | 400 vs 404 inconsistente para "no encontrado" | 🟡 MEDIA | Múltiples rutas |
| 8 | CORS hardcoded | 🟡 MEDIA | main.py:16-20 |
| 9 | Sin validación de longitud en schemas | 🟡 MEDIA | Todos los schemas |
| 10 | Registro duplicado de prefijo (/router/rt_) | 🟡 MEDIA | main.py:30-36 |

---

# Calificación Técnica: 72/100

| Criterio | Puntuación |
|-----------|-----------|
| **Funcionalidad** | 60/100 |
| **Seguridad** | 75/100 |
| **Rendimiento** | 80/100 |
| **Mantenibilidad** | 70/100 |
| **Código Limpio** | 75/100 |
| **Best Practices** | 75/100 |

---

# Análisis Minucioso - Hallazgos Detallados

---

## 1. Hallazgos Críticos (Errores que rompen funcionalidad)

### 📍 1.1 rt_synonyms.py - Ruta rota

**Ubicación**: `backend/app/api/routes/rt_synonyms.py`, línea 39

**El Problema**: Error tipográfico GRAVE en la ruta. Está definido:
```python
@router.get("/synonyms,{pages_id}", response_model=List[SynonymResponse])
```

Contiene una **coma** (`,`) en lugar de slash (`/`). Esta ruta NUNCA será alcanzable porque FastAPI interpretará `,pages_id` como parte del path literal.

**Solución Teórica**: El path parameter debe incluir el slash: `/synonyms/{pages_id}`. Siempre verifica que los paths sigan el patrón REST: `/recurso/{parametro}`.

---

### 📍 1.2 rt_sayings.py - Ruta rota

**Ubicación**: `backend/app/api/routes/rt_sayings.py`, línea 39

**El Problema**: Mismo error tipográfico:
```python
@router.get("/saying,{pages_id}", response_model=List[SayingResponse])
```

Ruta completamente inaccesible.

**Solución Teórica**: Cambiar a `/saying/{pages_id}`.

---

### 📍 1.3 rt_countries.py - Ruta rota

**Ubicación**: `backend/app/api/routes/rt_countries.py`, línea 39

**El Problema**: Mismo error crítico:
```python
@router.get("/country,{pages_id}", response_model= List[CountryResponse])
```

**Solución Teórica**: Cambiar a `/country/{pages_id}`.

---

### 📍 1.4 rt_countries.py - Nombre de función incorrecto

**Ubicación**: `backend/app/api/routes/rt_countries.py`, línea 40

**El Problema**: Nombre de función incorrecto e inconsistente:
```python
async def get_idiom(pages_iD: int, conex: AsyncSession = Depends(get_db)):
```

Debería ser `get_country`, no `get_idiom`. Esto confunde severely el propósito de la función.

**Solución Teórica**: El nombre de la función debe coincidir con el recurso. Nombra funciones según lo que hacen: `get_countries`, `create_country`, etc.

---

### 📍 1.5 md_Countries.py - Nomenclatura inconsistente

**Ubicación**: `backend/app/models/md_Countries.py`, línea 15

**El Problema**: Nomenclatura inconsistente de columna foránea:
```python
pages_iD: Mapped[int] = mapped_column(ForeignKey("pages.id"))
```

Otros modelos usan `page_id` o `pages_id`. Este usa `pages_iD` (i mayúscula). Además, en `rt_countries.py` línea 42 se usa correctamente `tbl_Country.pages_iD`, pero esto es una inconsistencia que dificulta el mantenimiento.

**Solución Teórica**: Estandariza los nombres de columnas. Elige un patrón y síguelo: `page_id` (recomendado). Verifica que modelo, schema y ruta usen el mismo nombre de campo.

---

### 📍 1.6 sch_country.py - Refleja inconsistencia del modelo

**Ubicación**: `backend/app/schemas/sch_country.py`, líneas 8, 20, 28

**El Problema**: Schema refleja la inconsistencia del modelo:
```python
pages_iD: int  # línea 8 en CountryResponse
pages_iD: int  # línea 20 en CountryCreate
pages_iD: Optional[int] = None  # línea 28 en CountryUpdate
```

**Solución Teórica**: El schema debe coincidir exactamente con el modelo. Cambia `pages_iD` a `page_id` para consistencia con el resto del codebase.

---

## 2. Hallazgos de Inconsistencia

### 📍 2.1 md_Synonyms.py - Comentario incorrecto

**Ubicación**: `backend/app/models/md_Synonyms.py`, línea 11

**El Problema**: Comentario genérico incorrecto:
```python
# Creamos tabla countries para base de datos
class Synonym(Base):
```

Debería decir "synonyms", no "countries".

**Solución Teórica**: Los comentarios deben describir el código que acompaña. Esto indica copiar/pegar sin ajustar.

---

### 📍 2.2 md_Idioms.py - Comentario incorrecto

**Ubicación**: `backend/app/models/md_Idioms.py`, línea 11

**El Problema**: Mismo comentario incorrecto:
```python
# Creamos tabla countries para base de datos
```

**Solución Teórica**: Debe decir "table 'idioms' for database".

---

### 📍 2.3 md_Sayings.py - Comentario incorrecto

**Ubicación**: `backend/app/models/md_Sayings.py`, línea 11

**El Problema**: Mismo comentario incorrecto:
```python
# Creamos tabla countries para base de datos
```

---

### 📍 2.4 rt_sayings.py - Nombre de función incorrecto

**Ubicación**: `backend/app/api/routes/rt_sayings.py`, línea 17

**El Problema**: Nombre de función incorrecto:
```python
async def create_synonym(saying: SayingCreate, ...
```

Dice "synonym" pero está creando un "Saying".

**Solución Teórica**: El nombre de la función debe coincidir con el recurso definido. Usa `create_saying`.

---

### 📍 2.5 rt_sayings.py - Comentario incorrecto

**Ubicación**: `backend/app/api/routes/rt_sayings.py`, línea 38

**El Problema**: Comentario incorrecto:
```python
# API para obtener synonym  # debería sayings
@router.get("/saying,{pages_id}", ...)
```

---

### 📍 2.6 md_Verbs.py - Inconsistencia ortográfica

**Ubicación**: `backend/app/models/md_Verbs.py`, línea 3

**El Problema**: Comentario con tilde inconsistente (istema mixto):
```python
# Verificamos que no hayan relaciones redundantes
```

Otros usan "# Comprobamos..." sin tilde.

**Solución Teórica**: Estandariza la ortografía en todo el proyecto (sin tildes o con tildes consistente).

---

## 3. Hallazgos de Código Inseguro o Problemático

### 📍 3.1 config.py - Sin validación de variables

**Ubicación**: `backend/app/core/config.py`, línea 9

**El Problema**: No hay validación de variables requeridas:
```python
model_config = SettingsConfigDict(env_file=".env")
```

Si el archivo `.env` no existe o falta una variable, la app fallará silenciosamente o con error críptico.

**Solución Teórica**: Usa `extra="forbid"` en `SettingsConfigDict` para forbidir campos extra no definidos, y proporciona valores por defecto o documenta variables requeridas claramente.

---

### 📍 3.2 database.py - echo=True en producción

**Ubicación**: `backend/app/core/database.py`, línea 12

**El Problema**: `echo=True` en producción:
```python
engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=True,  # Esto loguea TODAS las queries
)
```

Esto causa overhead masivo en producción y expone datos sensibles en logs.

**Solución Teórica**: Usa `echo=False` por defecto o controla via variable de entorno: `echo=settings.debug`.

---

### 📍 3.3 Manejo inconsistente de códigos HTTP

**Ubicación**: Múltiples archivos de rutas

**El Problema**: Manejo inconsistente de errores:
- Algunos usan `status_code=400` para "no encontrado"
- Otros usan `status_code=404`

Ejemplo en `rt_verbs.py` línea 51:
```python
if not verbs:
    raise HTTPException(status_code=400, detail="Verbos no encontrados")
```

Esto semanticamente es incorrecto. Los recursos no encontrados deberían ser 404, no 400.

**Solución Teórica**: Usa 404 para recursos no encontrados. El 400 es para datos inválidos o conflictos de negocio.

---

### 📍 3.4 main.py - CORS hardcoded

**Ubicación**: `backend/app/main.py`, líneas 16-20

**El Problema**: CORS hardcoded con orígenes específicos:
```python
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://code-english-beta.vercel.app/"
]
```

No permite otros entornos de desarrollo.

**Solución Teórica**: Lee orígenes de variable de entorno o usa configuración dinámica.

---

## 4. Hallazgos de Missing Validation

### 📍 4.1 Schemas - Sin validación de longitud

**Ubicación**: Todos los schemas

**El Problema**: No hay validación de longitud o formato en los schemas:
```python
base_form: Mapped[str] = mapped_column(String(25), index=True, nullable=False)
```

El String(25) está en SQLAlchemy pero no se refleja en el schema. Un usuario podría enviar strings de 1000 caracteres y pasar la validación de Pydantic.

**Solución Teórica**: Añade validación en los schemas Pydantic usando `Field(max_length=25)` o similar.

---

## 5. Hallazgos de Performance

### 📍 5.1 md_Pages.py - Relaciones sin estrategia de carga

**Ubicación**: `backend/app/models/md_Pages.py`, líneas 25-30

**El Problema**: No hay `lazy="select"` explícito en las relaciones:
```python
countries: Mapped[List["Country"]] = relationship(back_populates="page", cascade="all, delete-orphan")
```

En aplicaciones grandes, esto puede causar N+1 queries o cargar demasiado datos innecesariamente.

**Solución Teórica**: Considera usar `lazy="selectin"` o estrategias de carga explícitas según el caso de uso.

---

### 📍 5.2 database.py - Sin configuración de pool

**Ubicación**: `backend/app/core/database.py`

**El Problema**: Sin configuración de pool de conexiones:
```python
engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=True,
)
```

No hay `pool_size`, `max_overflow`, `pool_pre_ping` para manejo de conexiones caídas.

**Solución Teórica**: Configura `pool_pre_ping=True` para verificar conexiones antes de usar, y tunea `pool_size` según carga esperada.

---

## 6. Hallazgos de Mantenibilidad

### 📍 6.1 main.py - Registro duplicado de prefijo

**Ubicación**: `backend/app/main.py`, líneas 30-36

**El Problema**: Registro de routers duplica el prefijo:
```python
app.include_router(router_Page, prefix="/router/rt_pages", tags=["page"])
```

El prefijo ya incluye "rt_", lo cual es redundante. El path final sería `/router/rt_pages/create_page`.

**Solución Teórica**: Reduces redundancia: o usa `prefix="/api"` y deja que cada router defina su path, o simplifica los nombres de los routers.

---

### 📍 6.2 Sin documentación de endpoints

**Ubicación**: Todos los archivos de rutas

**El Problema**: No hay documentación de endpoints:
- Sin docstrings
- Sin comentarios explicando parámetros o retornos
- Sin ejemplos en documentación OpenAPI

**Solución Teórica**: Añade docstrings o usa el parámetro `description` en los decoradores de FastAPI.

---

# 🚀 Plan de Acción - Paso a Paso

---

## Paso 1: Corregir rutas rotas (CRÍTICO - Endpoints no funcionales)

### 1.1 rt_synonyms.py línea 39

**Antes**:
```python
@router.get("/synonyms,{pages_id}", response_model=List[SynonymResponse])
```

**Después**:
```python
@router.get("/synonyms/{pages_id}", response_model=List[SynonymResponse])
```

---

### 1.2 rt_sayings.py línea 39

**Antes**:
```python
@router.get("/saying,{pages_id}", response_model=List[SayingResponse])
```

**Después**:
```python
@router.get("/sayings/{pages_id}", response_model=List[SayingResponse])
```

---

### 1.3 rt_countries.py línea 39

**Antes**:
```python
@router.get("/country,{pages_id}", response_model= List[CountryResponse])
```

**Después**:
```python
@router.get("/countries/{pages_id}", response_model=List[CountryResponse])
```

---

## Paso 2: Estandarizar nomenclatura de columnas (CRÍTICO)

### 2.1 md_Countries.py - Cambiar pages_iD a page_id

**Antes** (línea 15):
```python
pages_iD: Mapped[int] = mapped_column(ForeignKey("pages.id"))
```

**Después**:
```python
page_id: Mapped[int] = mapped_column(ForeignKey("pages.id"))
```

También actualizar las líneas 25 y 30 que referencian `pages_iD`.

---

### 2.2 rt_countries.py - Sincronizar con el modelo

**Antes** (línea 42):
```python
stmt = select(tbl_Country).where(tbl_Country.pages_iD == pages_iD)
```

**Después**:
```python
stmt = select(tbl_Country).where(tbl_Country.page_id == page_id)
```

Y actualizar el nombre del parámetro de función de `pages_iD` a `page_id`.

---

### 2.3 sch_country.py - Actualizar nombres de campos

**Antes** (líneas 8, 20, 28):
```python
pages_iD: int
pages_iD: int
pages_iD: Optional[int] = None
```

**Después**:
```python
page_id: int
page_id: int
page_id: Optional[int] = None
```

---

## Paso 3: Corregir nombres de funciones incorrectos

### 3.1 rt_countries.py línea 40

**Antes**:
```python
async def get_idiom(pages_iD: int, conex: AsyncSession = Depends(get_db)):
```

**Después**:
```python
async def get_countries(page_id: int, conex: AsyncSession = Depends(get_db)):
```

---

### 3.2 rt_sayings.py línea 17

**Antes**:
```python
async def create_synonym(saying: SayingCreate, ...
```

**Después**:
```python
async def create_saying(saying: SayingCreate, ...
```

---

### 3.3 rt_sayings.py línea 39 - Cambiar comentario

**Antes**:
```python
# API para obtener synonym
```

**Después**:
```python
# API para obtener sayings
```

---

## Paso 4: Corregir echo=True en producción

### 4.1 database.py línea 12

**Antes**:
```python
engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=True,
)
```

**Después**:
```python
engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False,
)
```

O mejor, controlar via entorno:
```python
echo = settings.database_echo if hasattr(settings, 'database_echo') else False
```

---

## Paso 5: Corregir comentarios incorrectos (Código Limpio)

### 5.1 md_Synonyms.py línea 11

**Antes**:
```python
# Creamos tabla countries para base de datos
class Synonym(Base):
```

**Después**:
```python
# Creamos tabla synonyms para base de datos
class Synonym(Base):
```

---

### 5.2 md_Idioms.py línea 11

**Antes**:
```python
# Creamos tabla countries para base de datos
class Idiom(Base):
```

**Después**:
```python
# Creamos tabla idioms para base de datos
class Idiom(Base):
```

---

### 5.3 md_Sayings.py línea 11

**Antes**:
```python
# Creamos tabla countries para base de datos
class Saying(Base):
```

**Después**:
```python
# Creamos tabla sayings para base de datos
class Saying(Base):
```

---

## Paso 6: Estandarizar códigos HTTP

### 6.1 rt_verbs.py línea 51

**Antes**:
```python
if not verbs:
    raise HTTPException(status_code=400, detail="Verbos no encontrados")
```

**Después**:
```python
if not verbs:
    raise HTTPException(status_code=404, detail="Verbos no encontrados")
```

Repetir esta corrección en todos los endpoints GET donde se verifica "no encontrado".

---

## Paso 7: Mejorar configuración de seguridad

### 7.1 config.py - Añadir validación

**Antes**:
```python
model_config = SettingsConfigDict(env_file=".env")
```

**Después**:
```python
model_config = SettingsConfigDict(env_file=".env", extra="forbid")
```

---

### 7.2 database.py - Añadir pool_pre_ping

**Antes**:
```python
engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False,
)
```

**Después**:
```python
engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
)
```

---

## Paso 8: Añadir validación de campos en schemas (Opcional pero recomendado)

### 8.1 sch_verb.py - Añadir Field validation

**Antes**:
```python
class VerbCreate(BaseModel):
    page_id: int
    base_form: str
```

**Después**:
```python
from pydantic import Field

class VerbCreate(BaseModel):
    page_id: int
    base_form: str = Field(max_length=25)
    meaning: str = Field(max_length=25)
```

Repetir en los demás schemas según los límites definidos en los modelos SQLAlchemy.

---

## Paso 9: Mejorar CORS (Opcional)

### 9.1 main.py - Usar variable de entorno

**Antes**:
```python
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://code-english-beta.vercel.app/"
]
```

**Después** (configurando en config.py y leyendo aquí):
```python
from app.core.config import settings
origins = settings.cors_origins.split(",") if hasattr(settings, 'cors_origins') else ["*"]
```

---

# 📈 Resumen de Correcciones

| # | Corrección | Archivo(s) | Prioridad |
|---|-----------|-----------|-----------|
| 1 | `/resource,{id}` → `/resource/{id}` | rt_synonyms, rt_sayings, rt_countries | 🔴 CRÍTICA |
| 2 | `pages_iD` → `page_id` | md_Countries, sch_country, rt_countries | 🔴 CRÍTICA |
| 3 | `get_idiom` → `get_countries` | rt_countries.py | 🔴 ALTA |
| 4 | `create_synonym` → `create_saying` | rt_sayings.py | 🔴 ALTA |
| 5 | `echo=True` → `echo=False` | database.py | 🔴 ALTA |
| 6 | Corregir comentarios "countries" | md_Synonyms, md_Idioms, md_Sayings | 🟡 MEDIA |
| 7 | 400 → 404 para "no encontrado" | Múltiples rutas | 🟡 MEDIA |
| 8 | Añadir `pool_pre_ping=True` | database.py | 🟡 MEDIA |
| 9 | Añadir `extra="forbid"` | config.py | 🟡 MEDIA |

---

# ✅ Checklist de Verificación Post-Corrección

Después de aplicar las correcciones, verificar:

- [ ] Los 3 endpoints previously rotos ahora responden correctamente
- [ ] Todos los nombres de funciones coinciden con su propósito
- [ ] Las columnas foreign key son consistentes (`page_id` en todos)
- [ ] `echo=False` en database.py
- [ ] Los comentarios ya no dicen "countries" para otras tablas
- [ ] Los códigos HTTP son semánticamente correctos (404 para no encontrado)
- [ ] La aplicación inicia sin errores
- [ ] Los tests pasan correctamente

---

# 🎯 Conclusión

El código tiene una **arquitectura sólida** y usa tecnologías modernas correctamente. Los errores encontrados son principalmente:

1. **Errores tipográficos críticos** que rompen endpoints (comas en paths)
2. **Inconsistencias de naming** que dificultan el mantenimiento
3. **Detalles de configuración** que afectan seguridad y performance

Con las correcciones del Plan de Acción, el código raggiungerà un nível de calidad de **85-90/100**.