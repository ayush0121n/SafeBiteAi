import os
import httpx
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

USDA_API_KEY = os.getenv("USDA_API_KEY", "")
USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1"

async def fetch_nutrition_for_food(food_name: str) -> Optional[Dict[str, Any]]:
    """
    Search USDA FoodData Central for the given food name and return macronutrients.
    Returns None if not found or if API key is missing.
    """
    if not USDA_API_KEY or USDA_API_KEY == "your_usda_key_here":
        logger.warning("USDA_API_KEY is not set or invalid. Skipping nutrition fetch.")
        return None

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{USDA_BASE_URL}/foods/search",
                params={
                    "api_key": USDA_API_KEY,
                    "query": food_name,
                    "pageSize": 1,
                    "dataType": "Foundation,SR Legacy"
                },
                timeout=10.0
            )
            response.raise_for_status()
            data = response.json()

            if not data.get("foods"):
                return None

            food = data["foods"][0]
            nutrients = food.get("foodNutrients", [])

            # USDA Nutrient IDs: 
            # 1008: Energy (Calories)
            # 1003: Protein
            # 1005: Carbohydrate
            # 1004: Total lipid (fat)
            
            nutrition = {
                "calories": 0,
                "protein_g": 0,
                "carbs_g": 0,
                "fat_g": 0,
                "serving_g": 100 # Standard USDA measurement is per 100g
            }

            for n in nutrients:
                if n.get("nutrientNumber") == "1008" or n.get("nutrientId") == 1008:
                    nutrition["calories"] = round(n.get("value", 0))
                elif n.get("nutrientNumber") == "1003" or n.get("nutrientId") == 1003:
                    nutrition["protein_g"] = round(n.get("value", 0), 1)
                elif n.get("nutrientNumber") == "1005" or n.get("nutrientId") == 1005:
                    nutrition["carbs_g"] = round(n.get("value", 0), 1)
                elif n.get("nutrientNumber") == "1004" or n.get("nutrientId") == 1004:
                    nutrition["fat_g"] = round(n.get("value", 0), 1)

            return nutrition

    except Exception as e:
        logger.error(f"Error fetching USDA nutrition for {food_name}: {str(e)}")
        return None
