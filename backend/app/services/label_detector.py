from typing import List, Protocol
from app.schemas.detector import DetectedRegion

class LabelRegionDetector(Protocol):
    def detect_regions(self, image_path: str) -> List[DetectedRegion]:
        ...

class NoOpLabelDetector:
    def detect_regions(self, image_path: str) -> List[DetectedRegion]:
        return []

def get_label_detector(enable_detection: bool = False) -> LabelRegionDetector:
    # Future implementations will be added here based on configuration
    return NoOpLabelDetector()
