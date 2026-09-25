import json
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

def fetch_safer_alternatives(product_name: str, allergens: List[Dict[str, Any]], concerns: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Phase 3: Product Recommendations
    Mock fetching smarter alternatives from Open Food Facts.
    If this were fully connected to OFF, we would query `https://world.openfoodfacts.org/cgi/search.pl` 
    excluding `allergens_tags` and sorting by `nutriscore_score`.
    """
    logger.info(f"Fetching alternatives for {product_name} avoiding {len(allergens)} allergens and {len(concerns)} concerns...")
    
    # Generic mock alternatives
    alternatives = [
        {
            "id": "alt_1",
            "productName": "Nature's Path Organic Oats",
            "brand": "Nature's Path",
            "reason": "Lower in sugar and free from peanuts.",
            "highlights": "No added sugar, high fiber",
            "url": "https://world.openfoodfacts.org/product/0058449770119",
            "saved": False
        },
        {
            "id": "alt_2",
            "productName": "Kashi GoLean Cereal",
            "brand": "Kashi",
            "reason": "High protein alternative with lower sodium.",
            "highlights": "12g protein, 8g fiber",
            "url": "https://world.openfoodfacts.org/product/0018627703550",
            "saved": False
        }
    ]
    
    # If the user has specific concerns, we can adjust the mock
    if product_name and "biscuit" in product_name.lower():
        alternatives[0]["productName"] = "Simple Mills Almond Flour Crackers"
        alternatives[0]["brand"] = "Simple Mills"
        alternatives[0]["reason"] = "Gluten-free and made with whole foods."
        alternatives[0]["highlights"] = "Low glycemic index, 3g protein"
        
    return alternatives
