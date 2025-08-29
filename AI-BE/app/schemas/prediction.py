from pydantic import BaseModel

class PredictionResult(BaseModel):
    label: str
    confidence_real: float
    confidence_fake: float