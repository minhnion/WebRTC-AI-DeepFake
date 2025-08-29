from fastapi.middleware.cors import CORSMiddleware
from .config import settings

def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.FRONTEND_ORIGIN],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )