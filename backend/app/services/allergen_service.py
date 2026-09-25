"""Allergen matching service using rule-based JSON engine."""

import json
from pathlib import Path
from typing import List

RULES_DIR = Path(__file__).resolve().parent.parent / "rules"


def _load_allergens() -> dict:
    with open(RULES_DIR / "allergens.json", "r", encoding="utf-8") as f:
        return json.load(f)


def match_allergens(
    ingredients: List[str],
    allergy_statement: str | None,
    user_allergies: List[str],
) -> List[dict]:
    """
    Match ingredients and allergy statements against allergen rules.

    Returns a list of allergen match dicts with:
      name, match_type, severity, matched_text
    """
    allergen_db = _load_allergens()
    matches = []
    seen = set()

    # Normalize user allergies for comparison
    user_allergy_set = {a.lower() for a in user_allergies}

    for allergen_name, allergen_data in allergen_db.items():
        aliases = [a.lower() for a in allergen_data["aliases"]]
        severity = allergen_data["severity"]

        # Check direct ingredient matches
        for ingredient in ingredients:
            ing_lower = ingredient.lower()
            for alias in aliases:
                if alias in ing_lower and allergen_name not in seen:
                    is_user_allergen = allergen_name.lower() in user_allergy_set or any(
                        a in user_allergy_set for a in aliases
                    )
                    matches.append({
                        "name": allergen_name.capitalize(),
                        "match_type": "ingredient",
                        "severity": severity if is_user_allergen else "warning",
                        "matched_text": ingredient,
                    })
                    seen.add(allergen_name)
                    break

        # Check allergy statement for "may contain" / "contains" references
        if allergy_statement and allergen_name not in seen:
            stmt_lower = allergy_statement.lower()
            for alias in aliases:
                if alias in stmt_lower:
                    is_may_contain = "may contain" in stmt_lower or "traces" in stmt_lower
                    matches.append({
                        "name": allergen_name.capitalize(),
                        "match_type": "may_contain" if is_may_contain else "contains_statement",
                        "severity": "possible" if is_may_contain else severity,
                        "matched_text": allergy_statement,
                    })
                    seen.add(allergen_name)
                    break

    return matches


def determine_allergen_status(
    matches: List[dict],
    user_allergies: List[str],
) -> str:
    """
    Determine overall status based on allergen matches.

    Returns: 'avoid', 'caution', or 'safe'
    """
    user_allergy_set = {a.lower() for a in user_allergies}

    for m in matches:
        if m["severity"] == "critical":
            # Check if user actually listed this allergen
            if m["name"].lower() in user_allergy_set:
                return "avoid"
        if m["match_type"] == "may_contain":
            return "caution"

    if matches:
        return "caution"

    return "safe"
