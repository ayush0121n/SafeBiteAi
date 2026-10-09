import re
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

def extract_nutrition_from_text(ocr_text: str) -> Dict[str, Any]:
    """
    Robustly extract structured nutrition data from OCR text using regex patterns.
    Handles common variations in spelling, spacing, and units.
    """
    # Clean text: remove newlines, extra spaces, and convert to lower
    text = re.sub(r'\s+', ' ', ocr_text).strip().lower()
    
    nutrition_data = {
        "serving_size": "unknown",
        "calories": None,
        "total_fat_g": None,
        "saturated_fat_g": None,
        "trans_fat_g": None,
        "cholesterol_mg": None,
        "sodium_mg": None,
        "total_carbohydrate_g": None,
        "dietary_fiber_g": None,
        "total_sugars_g": None,
        "added_sugars_g": None,
        "protein_g": None,
    }

    # Helper function to extract numerical values
    def extract_val(pattern: str, text: str, group: int = 1) -> Optional[float]:
        match = re.search(pattern, text)
        if match:
            try:
                return float(match.group(group).replace(',', ''))
            except ValueError:
                return None
        return None

    # Serving size (e.g. "Serving Size 55g", "Serving Size 2/3 cup (55g)")
    serving_match = re.search(r'serving size\s*:?\s*([a-z0-9/.\-\s\(\)]+?)(?:amount per|calories|serving|%|\s\s)', text)
    if serving_match:
        val = serving_match.group(1).strip()
        # Clean trailing artifacts
        val = re.sub(r'(?:amoun|amount).*$', '', val).strip()
        if len(val) > 2 and len(val) < 40:
            nutrition_data["serving_size"] = val

    # Calories (handles calorles, calori, etc.)
    calories = extract_val(r'calor[il1e]?s?\s*:?\s*(\d+)', text)
    if calories is not None:
        nutrition_data["calories"] = calories
        
    # Total Fat (handles fal, fai)
    total_fat = extract_val(r'total fa[ti1l]\s*:?\s*(\d+(?:\.\d+)?)\s*g', text)
    if total_fat is not None:
        nutrition_data["total_fat_g"] = total_fat
        
    # Saturated Fat
    sat_fat = extract_val(r'saturat[a-z]* fa[ti1l]\s*:?\s*(\d+(?:\.\d+)?)\s*g', text)
    if sat_fat is not None:
        nutrition_data["saturated_fat_g"] = sat_fat

    # Trans Fat
    trans_fat = extract_val(r'trans fa[ti1l]\s*:?\s*(\d+(?:\.\d+)?)\s*g', text)
    if trans_fat is not None:
        nutrition_data["trans_fat_g"] = trans_fat
        
    # Cholesterol (handles choiesterol)
    cholesterol = extract_val(r'cholestero[il1]\s*:?\s*(\d+(?:\.\d+)?)\s*mg', text)
    if cholesterol is not None:
        nutrition_data["cholesterol_mg"] = cholesterol

    # Sodium (handles sodlum)
    sodium = extract_val(r'sod[il1]um\s*:?\s*(\d+(?:\.\d+)?)\s*mg', text)
    if sodium is not None:
        nutrition_data["sodium_mg"] = sodium

    # Total Carbohydrate (handles carbs)
    carbs = extract_val(r'total carb[a-z]*\s*:?\s*(\d+(?:\.\d+)?)\s*g', text)
    if carbs is not None:
        nutrition_data["total_carbohydrate_g"] = carbs

    # Dietary Fiber (handles flber)
    fiber = extract_val(r'dietary f[il1]ber\s*:?\s*(\d+(?:\.\d+)?)\s*g', text)
    if fiber is not None:
        nutrition_data["dietary_fiber_g"] = fiber
        
    # Total Sugars (matches 'total sugars 12g', 'sugars 12g', etc.)
    sugars = extract_val(r'(?:total\s+)?sugars?\s*:?\s*(\d+(?:\.\d+)?)\s*g', text)
    if sugars is not None:
        nutrition_data["total_sugars_g"] = sugars

    # Added Sugars (matches 'includes 10g added sugars', 'added sugars 10g')
    added_sugars_1 = extract_val(r'includes\s*(\d+(?:\.\d+)?)\s*g\s*(?:of\s*)?added sugars?', text)
    added_sugars_2 = extract_val(r'added sugars?\s*:?\s*(\d+(?:\.\d+)?)\s*g', text)
    if added_sugars_1 is not None:
        nutrition_data["added_sugars_g"] = added_sugars_1
    elif added_sugars_2 is not None:
        nutrition_data["added_sugars_g"] = added_sugars_2

    # Protein (handles prote[il1]n)
    protein = extract_val(r'prote[il1]n\s*:?\s*(\d+(?:\.\d+)?)\s*g', text)
    if protein is not None:
        nutrition_data["protein_g"] = protein

    return nutrition_data
