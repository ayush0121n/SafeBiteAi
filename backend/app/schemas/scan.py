from pydantic import BaseModel
from typing import List, Optional


class AllergenMatch(BaseModel):
    name: str
    match_type: str  # ingredient | contains_statement | may_contain
    severity: str    # critical | warning | possible
    matched_text: str


class NutritionData(BaseModel):
    serving_size: Optional[str] = None
    calories: Optional[float] = None
    total_sugar_g: Optional[float] = None
    added_sugar_g: Optional[float] = None
    sodium_mg: Optional[float] = None
    saturated_fat_g: Optional[float] = None
    fiber_g: Optional[float] = None
    protein_g: Optional[float] = None


class Concern(BaseModel):
    category: str
    level: str  # lower | moderate | higher | unknown
    title: str
    plain_language_reason: str
    factors: List[str]


class Confidence(BaseModel):
    overall: float
    ocr: float
    ingredients: float
    nutrition: float


class ExtractedText(BaseModel):
    ingredients_raw: Optional[str] = None
    ingredients_normalized: List[str] = []
    allergy_statement: Optional[str] = None


class ScanCreateResponse(BaseModel):
    scan_id: str
    status: str


class ScanResult(BaseModel):
    scan_id: str
    status: str  # safe | caution | avoid | uncertain
    analysis_state: str  # processing | completed | failed
    confidence: Confidence
    extracted_text: ExtractedText
    allergens: List[AllergenMatch]
    nutrition: NutritionData
    concerns: List[Concern]
    disclaimers: List[str]
    created_at: str
