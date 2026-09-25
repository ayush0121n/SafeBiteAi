"""Ingredient normalization and parsing service."""

import json
import re
from pathlib import Path
from typing import List, Tuple

RULES_DIR = Path(__file__).resolve().parent.parent / "rules"


def _load_aliases() -> dict:
    with open(RULES_DIR / "ingredient_aliases.json", "r", encoding="utf-8") as f:
        return json.load(f)


def normalize_ingredient(text: str) -> str:
    """Normalize an ingredient string: lowercase, strip, remove extra whitespace."""
    text = text.lower().strip()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[()]", "", text)
    return text


def parse_ingredients_text(raw_text: str) -> Tuple[List[str], str | None]:
    """
    Split raw OCR text into individual ingredients and an allergy statement.

    Returns (normalized_ingredients, allergy_statement_or_none).
    """
    allergy_statement = None

    # Look for allergy statement patterns
    allergy_patterns = [
        r"(?:contains|may contain|produced in.*?that.*?processes)[:\s].*",
        r"allergen\s*(?:information|advice|warning)[:\s].*",
    ]
    for pattern in allergy_patterns:
        match = re.search(pattern, raw_text, re.IGNORECASE)
        if match:
            allergy_statement = match.group(0).strip()
            break

    # Try splitting by common separators
    # Remove the allergy statement from ingredient parsing
    ingredient_text = raw_text
    if allergy_statement:
        ingredient_text = raw_text[: raw_text.lower().find(allergy_statement.lower())].strip()

    # Remove "ingredients:" prefix
    ingredient_text = re.sub(r"^ingredients?\s*:\s*", "", ingredient_text, flags=re.IGNORECASE)

    # Split by commas, semicolons, or periods (common separators)
    raw_items = re.split(r"[,;.]", ingredient_text)
    ingredients = [normalize_ingredient(item) for item in raw_items if item.strip()]

    return ingredients, allergy_statement


def resolve_aliases(ingredients: List[str]) -> List[str]:
    """Map ingredient aliases to their canonical names."""
    aliases = _load_aliases()
    resolved = []
    for ing in ingredients:
        matched = False
        for canonical, alias_list in aliases.items():
            for alias in alias_list:
                if alias.lower() in ing:
                    resolved.append(canonical)
                    matched = True
                    break
            if matched:
                break
        if not matched:
            resolved.append(ing)
    return resolved
