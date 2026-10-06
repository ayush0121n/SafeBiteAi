from typing import List, Dict

HIDDEN_SUGARS = [
    "maltodextrin", "dextrose", "glucose", "fructose", "sucrose", "corn syrup",
    "high fructose corn syrup", "hfcs", "invert sugar", "cane sugar",
    "brown rice syrup", "agave", "maple syrup", "molasses", "honey",
    "fruit juice concentrate", "evaporated cane juice", "glucose syrup",
    "barley malt", "maltose", "treacle", "golden syrup"
]

ULTRA_PROCESSED_MARKERS = [
    "emulsifier", "emulsifiers", "colour", "color", "flavour", "flavor",
    "preservative", "stabilizer", "stabiliser", "thickener", "gelling agent",
    "artificial", "modified starch", "hydrogenated", "interesterified"
]

def analyze_sugar_and_nova(ingredients: List[str]) -> Dict:
    found_sugars = []
    for ing in ingredients:
        lower = ing.lower()
        for sugar in HIDDEN_SUGARS:
            if sugar in lower:
                found_sugars.append(sugar.title())

    found_sugars = list(set(found_sugars))
    
    ultra_signals = len(found_sugars)
    for ing in ingredients:
        lower = ing.lower()
        for marker in ULTRA_PROCESSED_MARKERS:
            if marker in lower:
                ultra_signals += 1
                break

    if ultra_signals >= 4:
        nova = 4
        label = "Ultra-processed (NOVA Group 4)"
    elif ultra_signals >= 2:
        nova = 3
        label = "Processed (NOVA Group 3)"
    elif ultra_signals >= 1:
        nova = 2
        label = "Processed Culinary Ingredient (NOVA 2)"
    else:
        nova = 1
        label = "Unprocessed / Minimally processed (NOVA 1)"

    return {
        "hidden_sugars": found_sugars,
        "hidden_sugar_count": len(found_sugars),
        "nova_group": nova,
        "nova_label": label,
        "is_ultra_processed": nova == 4,
        "risk_level": "high" if nova == 4 else "moderate" if nova == 3 else "low"
    }
