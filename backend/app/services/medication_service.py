from typing import List, Dict

MEDICATION_INTERACTIONS = {
    "warfarin": ["spinach", "kale", "broccoli", "cabbage", "lettuce", "leafy greens", "vitamin k", "cranberry"],
    "statin": ["grapefruit", "pomelo", "seville orange", "bergamot"],
    "maoi": ["aged cheese", "cured meat", "soy sauce", "tofu", "sauerkraut", "tyramine", "miso", "tempeh", "salami"],
    "ace inhibitor": ["banana", "orange", "potato", "salt substitute", "potassium"],
    "thyroid": ["soy", "walnuts", "calcium", "iron"],
    "tetracycline": ["milk", "cheese", "yogurt", "calcium", "dairy"],
    "fluoroquinolone": ["milk", "cheese", "yogurt", "calcium", "dairy"],
}

def check_medication_interactions(ingredients: List[str], user_medications: List[str]) -> List[Dict]:
    alerts = []
    
    user_meds_lower = [m.lower() for m in user_medications]
    
    for med, bad_foods in MEDICATION_INTERACTIONS.items():
        # Only check if user is on this class of medication
        med_matched = False
        matched_name = ""
        for user_med in user_meds_lower:
            if med in user_med or user_med in med:
                med_matched = True
                matched_name = user_med.capitalize()
                break
                
        if not med_matched:
            continue
            
        found_foods = []
        for ing in ingredients:
            ing_lower = ing.lower()
            for bad_food in bad_foods:
                if bad_food in ing_lower:
                    found_foods.append(bad_food.capitalize())
        
        found_foods = list(set(found_foods))
        if found_foods:
            alerts.append({
                "category": "medication_interaction",
                "level": "higher",
                "title": f"Medication Interaction: {matched_name}",
                "plain_language_reason": f"Found ingredients ({', '.join(found_foods)}) that may interact severely with your {matched_name} prescription.",
                "factors": found_foods
            })
            
    return alerts
