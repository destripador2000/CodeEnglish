from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes.rt_pages import router as router_Page
from app.api.routes.rt_vocabularies import router as router_Vocabulary
from app.api.routes.rt_verbs import router as router_Verb
from app.api.routes.rt_synonyms import router as router_Synonym
from app.api.routes.rt_sayings import router as router_Saying
from app.api.routes.rt_idioms import router as router_Idiom
from app.api.routes.rt_countries import router as router_Country
from app.models import *

app = FastAPI(title=settings.app_name)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://code-english-beta.vercel.app/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router_Page, prefix="/router/rt_pages", tags=["page"])
app.include_router(router_Vocabulary, prefix="/router/rt_vocabularies", tags=["vocabularies"])
app.include_router(router_Verb, prefix="/router/rt_verbs", tags=["verbs"])
app.include_router(router_Synonym, prefix="/router/rt_synonyms", tags=["synonyms"])
app.include_router(router_Saying, prefix="/router/rt_sayings", tags=["sayings"])
app.include_router(router_Idiom, prefix="/router/rt_idioms", tags=["idioms"])
app.include_router(router_Country, prefix="/router/rt_countries", tags=["countries"])


@app.get("/")
async def root():
    return {"Servidor encendido"}
