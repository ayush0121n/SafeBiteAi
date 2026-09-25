from pydantic import BaseModel
from typing import List

class BBox(BaseModel):
    x: int
    y: int
    width: int
    height: int

class DetectedRegion(BaseModel):
    label: str
    confidence: float
    bbox: BBox

class DetectionResult(BaseModel):
    regions: List[DetectedRegion]
