from fastapi import FastAPI
from app.core.security import setup_cors
from app.api.v1 import endpoints

app = FastAPI(
    title="Deepfake Detection API",
    description="Backend for WebRTC video call with real-time deepfake detection.",
    version="1.0.0"
)

setup_cors(app)

app.include_router(endpoints.router, prefix="/api/v1", tags=["v1"])

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Deepfake Detection API!"}