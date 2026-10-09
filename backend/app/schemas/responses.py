from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ScanResponse(BaseModel):
    scanId: str
    productName: str
    status: str
    analysisState: str
    isMock: bool
    pipelineUsed: str
    confidence: Dict[str, float]
    extractedText: Dict[str, Any]
    allergens: List[Dict[str, Any]]
    nutrition: Dict[str, Any]
    concerns: List[Dict[str, Any]]
    alternatives: Optional[List[Dict[str, Any]]] = []
    disclaimers: List[str]
