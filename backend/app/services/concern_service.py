"""Nutrition concern evaluation service using configurable thresholds."""

import json
from pathlib import Path
from typing import List

RULES_DIR = Path(__file__).resolve().parent.parent / "rules"


def _load_thresholds() -> dict:
    with open(RULES_DIR / "nutrition_thresholds.json", "r", encoding="utf-8") as f:
        return json.load(f)


def _load_templates() -> dict:
    with open(RULES_DIR / "explanation_templates.json", "r", encoding="utf-8") as f:
        return json.load(f)


def evaluate_concerns(
    nutrition: dict,
    user_conditions: List[str],
    user_preferences: List[str],
    ingredients: List[str],
) -> List[dict]:
    """
    Evaluate nutrition data against thresholds and user profile.

    Returns a list of concern dicts.
    """
    thresholds = _load_thresholds()
    templates = _load_templates()
    concerns = []

    # Sodium check
    sodium = nutrition.get("sodium_mg")
    if sodium is not None:
        sodium_thresholds = thresholds.get("sodium_mg_per_serving", {})
        if "hypertension" in user_conditions or "low_sodium" in user_preferences:
            if sodium >= sodium_thresholds.get("higher", 600):
                concerns.append({
                    "category": "blood_pressure",
                    "level": "higher",
                    "title": templates.get("high_sodium", {}).get("title", "Higher salt amount"),
                    "plain_language_reason": templates.get("high_sodium", {}).get(
                        "message",
                        f"This product has {sodium}mg of sodium per serving."
                    ),
                    "factors": [i for i in ingredients if "salt" in i or "sodium" in i],
                })
            elif sodium >= sodium_thresholds.get("moderate", 300):
                concerns.append({
                    "category": "blood_pressure",
                    "level": "moderate",
                    "title": "Moderate salt amount",
                    "plain_language_reason": f"Sodium is {sodium}mg per serving. Moderate range for most diets.",
                    "factors": [i for i in ingredients if "salt" in i or "sodium" in i],
                })
        else:
            if sodium >= sodium_thresholds.get("higher", 600):
                concerns.append({
                    "category": "blood_pressure",
                    "level": "lower",
                    "title": "Salt amount noted",
                    "plain_language_reason": f"Sodium is {sodium}mg per serving.",
                    "factors": [i for i in ingredients if "salt" in i or "sodium" in i],
                })

    # Added sugar check
    added_sugar = nutrition.get("added_sugar_g")
    if added_sugar is not None:
        sugar_thresholds = thresholds.get("added_sugar_g_per_serving", {})
        if "diabetes" in user_conditions or "low_sugar" in user_preferences:
            if added_sugar >= sugar_thresholds.get("higher", 15):
                concerns.append({
                    "category": "blood_sugar",
                    "level": "higher",
                    "title": templates.get("added_sugar", {}).get("title", "Added sugar found"),
                    "plain_language_reason": templates.get("added_sugar", {}).get(
                        "message",
                        f"This product has {added_sugar}g of added sugar per serving."
                    ),
                    "factors": [i for i in ingredients if "sugar" in i or "syrup" in i or "dextrose" in i],
                })
            elif added_sugar >= sugar_thresholds.get("moderate", 8):
                concerns.append({
                    "category": "blood_sugar",
                    "level": "moderate",
                    "title": "Moderate sugar amount",
                    "plain_language_reason": f"Added sugar is {added_sugar}g per serving.",
                    "factors": [i for i in ingredients if "sugar" in i or "syrup" in i],
                })

    # Saturated fat check
    sat_fat = nutrition.get("saturated_fat_g")
    if sat_fat is not None:
        fat_thresholds = thresholds.get("saturated_fat_g_per_serving", {})
        if "heart_health" in user_conditions or "low_saturated_fat" in user_preferences:
            if sat_fat >= fat_thresholds.get("higher", 5):
                concerns.append({
                    "category": "heart_health",
                    "level": "higher",
                    "title": "Higher saturated fat",
                    "plain_language_reason": f"Saturated fat is {sat_fat}g per serving. This may matter for heart health goals.",
                    "factors": [i for i in ingredients if "oil" in i or "butter" in i or "fat" in i],
                })
            elif sat_fat >= fat_thresholds.get("moderate", 3):
                concerns.append({
                    "category": "heart_health",
                    "level": "moderate",
                    "title": "Moderate saturated fat",
                    "plain_language_reason": f"Saturated fat is {sat_fat}g per serving.",
                    "factors": [i for i in ingredients if "oil" in i or "butter" in i],
                })

    return concerns


def determine_overall_status(
    allergen_status: str,
    concerns: List[dict],
    ocr_confidence: float,
) -> str:
    """
    Determine the final overall status for a scan.
    Priority: uncertain > avoid > caution > safe
    """
    if ocr_confidence < 0.70:
        return "uncertain"

    if allergen_status == "avoid":
        return "avoid"

    has_higher = any(c["level"] == "higher" for c in concerns)
    has_moderate = any(c["level"] == "moderate" for c in concerns)

    if allergen_status == "caution" or has_higher:
        return "caution"

    if has_moderate:
        return "caution"

    return "safe"
