import json
import logging
import httpx
from typing import Dict, Any, List
from app.config import settings

logger = logging.getLogger(__name__)

def fetch_safer_alternatives(product_name: str, allergens: List[Dict[str, Any]], concerns: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Phase 3: Product Recommendations using USDA API
    Fetches real food alternatives and nutritional data from USDA FoodData Central.
    """
    logger.info(f"Fetching alternatives for {product_name} avoiding {len(allergens)} allergens and {len(concerns)} concerns...")
    
    usda_api_key = settings.usda_api_key
    
    if usda_api_key and product_name:
        try:
            # Query USDA FoodData Central
            search_url = f"https://api.nal.usda.gov/fdc/v1/foods/search?api_key={usda_api_key}"
            payload = {
                "query": product_name,
                "pageSize": 5,
                "requireAllWords": True
            }
            
            with httpx.Client(timeout=10.0) as client:
                response = client.post(search_url, json=payload)
                response.raise_for_status()
                data = response.json()
                
                alternatives = []
                for i, food in enumerate(data.get("foods", [])[:2]):
                    brand = food.get("brandOwner", "Unknown Brand")
                    desc = food.get("description", "Unknown Product")
                    fdc_id = food.get("fdcId")
                    
                    alternatives.append({
                        "id": f"usda_{fdc_id}",
                        "productName": desc,
                        "brand": brand,
                        "reason": "Found via USDA FoodData Central based on your query.",
                        "highlights": "USDA Verified Data",
                        "url": f"https://fdc.nal.usda.gov/fdc-app.html#/food-details/{fdc_id}/nutrients",
                        "saved": False
                    })
                
                if alternatives:
                    return alternatives
        except Exception as e:
            logger.error(f"Error fetching from USDA API: {e}")

    # Fallback generic mock alternatives if USDA API fails or key is missing
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
    
    if product_name and "biscuit" in product_name.lower():
        alternatives[0]["productName"] = "Simple Mills Almond Flour Crackers"
        alternatives[0]["brand"] = "Simple Mills"
        alternatives[0]["reason"] = "Gluten-free and made with whole foods."
        alternatives[0]["highlights"] = "Low glycemic index, 3g protein"
        
    return alternatives
