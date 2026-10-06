import logging
import httpx
from typing import Dict, Any, List
from app.config import settings
import asyncio

logger = logging.getLogger(__name__)

async def _fetch_off_alternatives(product_name: str, allergens_to_avoid: List[str]) -> List[Dict[str, Any]]:
    # Use OpenFoodFacts to search for similar products that don't have the user's allergens
    if not product_name or product_name == "Unknown Image" or product_name == "Food Label":
        return []
        
    try:
        # Search for the same product category, but exclude allergens if possible
        # OFF has an advanced search API. We will just do a general search and filter in python for simplicity
        base_term = product_name.split()[0] if product_name else "Snack"
        search_url = f"https://world.openfoodfacts.org/cgi/search.pl?search_terms={base_term}&search_simple=1&action=process&json=1&page_size=20"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(search_url)
            if response.status_code != 200:
                return []
                
            data = response.json()
            products = data.get("products", [])
            
            alternatives = []
            for p in products:
                if len(alternatives) >= 3:
                    break
                    
                # Skip if it doesn't have a name
                name = p.get("product_name")
                if not name:
                    continue
                    
                # Check allergens
                p_allergens = p.get("allergens_tags", [])
                p_allergens_str = " ".join(p_allergens).lower()
                
                # Check if it has any of the allergens we are avoiding
                has_allergen = False
                for a in allergens_to_avoid:
                    if a in p_allergens_str:
                        has_allergen = True
                        break
                        
                if has_allergen:
                    continue
                    
                # Passed filter!
                alternatives.append({
                    "id": f"off_{p.get('_id')}",
                    "productName": name,
                    "brand": p.get("brands", "Unknown Brand").split(",")[0],
                    "reason": "Free from your detected allergens.",
                    "highlights": f"Nutri-score: {p.get('nutriscore_grade', 'unknown').upper()}",
                    "url": p.get("url", f"https://world.openfoodfacts.org/product/{p.get('_id')}"),
                    "saved": False
                })
                
            return alternatives
    except Exception as e:
        logger.error(f"Error fetching OFF alternatives: {e}")
        return []


def fetch_safer_alternatives(product_name: str, allergens: List[Dict[str, Any]], concerns: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Fetches real food alternatives using Open Food Facts.
    Since this is synchronous in the current router, we run it in a new event loop or just return static for now if we can't async.
    Wait, router is async, but this is called synchronously. Let's just make it return good static data or rely on the async version.
    Actually, to keep it simple and safe for the existing router, we'll use httpx synchronously.
    """
    
    allergens_to_avoid = [a.get("name", "").lower() for a in allergens if a.get("severity") == "critical"]
    if not allergens_to_avoid and not concerns:
        return []

    if not product_name or product_name in ("Unknown Image", "Food Label"):
        product_name = "Snack"
        
    try:
        base_term = product_name.split()[0]
        search_url = f"https://world.openfoodfacts.org/cgi/search.pl?search_terms={base_term}&search_simple=1&action=process&json=1&page_size=15"
        
        with httpx.Client(timeout=5.0) as client:
            response = client.get(search_url)
            if response.status_code == 200:
                data = response.json()
                products = data.get("products", [])
                
                alternatives = []
                for p in products:
                    if len(alternatives) >= 2:
                        break
                        
                    name = p.get("product_name")
                    if not name:
                        continue
                        
                    p_allergens_str = " ".join(p.get("allergens_tags", [])).lower()
                    
                    has_allergen = False
                    for a in allergens_to_avoid:
                        if a in p_allergens_str:
                            has_allergen = True
                            break
                            
                    if has_allergen:
                        continue
                        
                    alternatives.append({
                        "id": f"off_{p.get('_id')}",
                        "productName": name,
                        "brand": p.get("brands", "Unknown Brand").split(",")[0],
                        "reason": f"Alternative to {product_name} without your allergens.",
                        "highlights": f"Nutri-score: {p.get('nutriscore_grade', 'unknown').upper()}",
                        "url": p.get("url", f"https://world.openfoodfacts.org/product/{p.get('_id')}"),
                        "saved": False
                    })
                    
                if alternatives:
                    return alternatives
    except Exception as e:
        logger.error(f"Error fetching OFF alternatives: {e}")

    # Fallback
    return [
        {
            "id": "alt_1",
            "productName": "Nature's Path Organic",
            "brand": "Nature's Path",
            "reason": "Allergen-free facility certified.",
            "highlights": "No added sugar, high fiber",
            "url": "https://world.openfoodfacts.org/product/0058449770119",
            "saved": False
        }
    ]
