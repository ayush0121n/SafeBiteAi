import httpx
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

async def fetch_safer_alternatives(
    product_name: str,
    allergens: List[Dict],
    concerns: List[Dict],
    limit: int = 4
) -> List[Dict]:
    """
    Query Open Food Facts for safer alternatives.
    """
    allergen_names = [a["name"].lower() for a in allergens]
    
    # Build a simple search that avoids the main allergens
    search_terms = product_name.split()[0] if product_name and product_name not in ("Unknown Image", "Food Label") else "snack"
    
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            # Search Open Food Facts
            params = {
                "search_terms": search_terms,
                "search_simple": 1,
                "action": "process",
                "json": 1,
                "page_size": 15,
            }
            resp = await client.get("https://world.openfoodfacts.org/cgi/search.pl", params=params)
            
            if resp.status_code != 200:
                return _fallback_alternatives()

            data = resp.json()
            products = data.get("products", [])

            alternatives = []
            for p in products:
                name = p.get("product_name") or p.get("generic_name")
                if not name:
                    continue

                # Simple allergen filter
                ingredients_text = (p.get("ingredients_text") or "").lower()
                labels = " ".join(p.get("labels_tags", [])).lower()

                has_allergen = any(a in ingredients_text or a in labels for a in allergen_names)
                if has_allergen:
                    continue

                alternatives.append({
                    "id": f"off_{p.get('code', 'unknown')}",
                    "productName": name[:60],
                    "brand": p.get("brands", "Unknown")[:40],
                    "reason": "Lower risk alternative based on available data",
                    "highlights": f"Nutri-score: {p.get('nutriscore_grade', 'unknown').upper()}",
                    "url": p.get("url", f"https://world.openfoodfacts.org/product/{p.get('code', '')}"),
                    "saved": False
                })

                if len(alternatives) >= limit:
                    break

            return alternatives if alternatives else _fallback_alternatives()

    except Exception as e:
        logger.error(f"Error fetching OFF alternatives: {e}")
        return _fallback_alternatives()


def _fallback_alternatives() -> List[Dict]:
    return [
        {
            "id": "alt_1",
            "productName": "Nature's Path Organic Oats",
            "brand": "Nature's Path",
            "reason": "Generally lower in common allergens and less processed",
            "highlights": "No added sugar, high fiber",
            "url": "https://world.openfoodfacts.org/product/0058449770119",
            "saved": False
        },
        {
            "id": "alt_2",
            "productName": "Simple whole-food options",
            "brand": "Generic",
            "reason": "Consider plain nuts, fruits, or yogurt if suitable for your profile",
            "highlights": "Whole Foods",
            "url": "https://world.openfoodfacts.org",
            "saved": False
        }
    ]
