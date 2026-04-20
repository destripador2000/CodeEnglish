from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes.rt_pages import router as router_Page
from app.api.routes.rt_vocabularies import router as router_Vocabulary
from app.api.routes.rt_verbs import router as router_Verb
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
app.include_router(router_Verb, prefix="/router/rt_verb", tags=["verbs"])


@app.get("/")
async def root():
    return {"Servidor encendido"}
