from pydantic import BaseModel
from typing import List, Optional


class ProfileUpdate(BaseModel):
    allergies: List[str] = []
    conditions: List[str] = []
    preferences: List[str] = []
    accessibility: dict = {"large_text": False, "high_contrast": False, "voice_readout": False}


class ProfileResponse(BaseModel):
    id: str
    allergies: List[str]
    conditions: List[str]
    preferences: List[str]
    accessibility: dict
