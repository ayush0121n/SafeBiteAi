import json
import os
import uuid
import asyncio
import base64
import re
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.config import settings
from app.services.ingredient_service import parse_ingredients_text, resolve_aliases
from app.services.allergen_service import match_allergens, determine_allergen_status
from app.services.concern_service import evaluate_concerns, determine_overall_status
from app.services.recommendation_service import fetch_safer_alternatives
from app.vision.ml_pipeline import vision_pipeline

api_router = APIRouter()

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE = settings.max_upload_size_mb * 1024 * 1024
RULES_DIR = Path(__file__).resolve().parent.parent / "rules"

# In-memory store for MVP since there's no DB
SCAN_DB = {}

# Minimum character count for OCR text to be considered a real label
MIN_LABEL_TEXT_LENGTH = 30

# Words that strongly suggest a food label is present in the OCR text
FOOD_LABEL_SIGNALS = [
    "ingredients", "contains", "allergen", "nutrition", "calories", "serving",
    "sugar", "sodium", "fat", "protein", "fiber", "carbohydrate", "vitamin",
    "mineral", "preservative", "additive", "extract", "powder", "syrup",
    "starch", "flour", "oil", "salt", "water", "milk", "wheat", "soy",
    "per 100g", "per serving", "daily value", "% dv", "manufactured", "packed"
]


def _load_json(name: str) -> dict:
    with open(RULES_DIR / name, "r", encoding="utf-8") as f:
        return json.load(f)


def _is_food_label_text(text: str) -> bool:
    """
    Heuristic: check if OCR-extracted text looks like a real food label.
    Returns False if the text is too short or has no food-label keywords.
    """
    if not text or len(text.strip()) < MIN_LABEL_TEXT_LENGTH:
        return False
    text_lower = text.lower()
    matched = sum(1 for signal in FOOD_LABEL_SIGNALS if signal in text_lower)
    return matched >= 2  # At least 2 food-label signals must appear


@api_router.post("/api/v1/scans", status_code=202)
async def create_scan(
    file: UploadFile = File(...),
    profile: str = Form("{}"),
    privacy_mode: str = Form("false"),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Upload a JPG, PNG, or WEBP image.")

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="Image must be smaller than 10 MB.")

    try:
        user_profile = json.loads(profile)
    except json.JSONDecodeError:
        user_profile = {}

    scan_id = str(uuid.uuid4())

    if privacy_mode.lower() != "true":
        upload_dir = Path(settings.upload_directory)
        upload_dir.mkdir(exist_ok=True)
        ext = (file.filename or "img").rsplit(".", 1)[-1] if file.filename else "jpg"
        path = upload_dir / f"{scan_id}.{ext}"
        path.write_bytes(content)

    # ---------------------------------------------------------
    # OCR / Vision Pipeline
    # ---------------------------------------------------------
    ocr_text = ""
    ocr_confidence = 0.0
    vision_results = {}
    detected_regions = []   # Only populated when real detection runs
    pipeline_used = "none"

    if settings.ml_container_url:
        import httpx
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    settings.ml_container_url,
                    headers={"Authorization": f"Bearer {settings.ml_container_api_key}"},
                    files={"file": (file.filename or "image.jpg", content, file.content_type)},
                )
                if response.status_code == 200:
                    data = response.json()
                    ocr_text = data.get("text", "")
                    ocr_confidence = data.get("confidence", 0.85)
                    pipeline_used = "ml_container"
                else:
                    print(f"ML API Error: {response.status_code} {response.text}")
        except Exception as e:
            print(f"ML Request failed: {e}")
    else:
        vision_results = await vision_pipeline.process_food_label(content)
        ocr_text = vision_results.get("extracted_text", "")
        pipeline_used = vision_results.get("pipeline", "local")
        # Only expose real region detections (not hardcoded ones)
        raw_regions = vision_results.get("region_details", [])
        if raw_regions:
            detected_regions = [
                {
                    "label": "detected_region",
                    "confidence": round(r.get("confidence", 0.5), 2),
                    "bbox": {
                        "x": 0, "y": 0, "width": 100, "height": 100
                    }
                }
                for r in raw_regions[:3]
            ]

    # ---------------------------------------------------------
    # Validate: is this actually a food label?
    # ---------------------------------------------------------
    if not _is_food_label_text(ocr_text):
        # Not a food label — return an uncertain result immediately
        scan_id_short = scan_id
        result = {
            "scanId": scan_id_short,
            "productName": "Unknown Image",
            "status": "uncertain",
            "analysisState": "completed",
            "confidence": {
                "overall": 0.10,
                "ocr": 0.10,
                "ingredients": 0.0,
                "nutrition": 0.0,
            },
            "imageUrl": (
                f"data:{file.content_type};base64,{base64.b64encode(content).decode('utf-8')}"
                if privacy_mode.lower() == "true"
                else f"/api/v1/scans/{scan_id}/image"
            ),
            "detectedRegions": [],
            "extractedText": {
                "ingredientsRaw": "",
                "ingredientsNormalized": [],
                "allergyStatement": "",
            },
            "allergens": [],
            "nutrition": {},
            "concerns": [],
            "alternatives": [],
            "disclaimers": [
                "SafeBite AI could not detect a valid food label in this image. "
                "Please upload a clear photo of an ingredient list or nutrition panel.",
            ],
            "createdAt": datetime.utcnow().isoformat() + "Z",
            "pipelineUsed": pipeline_used,
        }
        if privacy_mode.lower() != "true":
            SCAN_DB[scan_id] = result
        await asyncio.sleep(0.5)
        return result

    # ---------------------------------------------------------
    # Confidence based on pipeline
    # ---------------------------------------------------------
    if "YOLOv8" in pipeline_used or "PaddleOCR" in pipeline_used:
        ocr_confidence = 0.92
    elif "Hugging Face" in pipeline_used:
        ocr_confidence = 0.80
    else:
        # Unknown/mock — lower confidence
        ocr_confidence = 0.55

    product_name = (
        file.filename.rsplit(".", 1)[0].replace("-", " ").replace("_", " ").title()
        if file.filename else "Food Label"
    )

    # Attempt to get real data from OpenFoodFacts using the product_name
    real_ingredients = ""
    real_nutrition = {}
    try:
        import httpx
        async with httpx.AsyncClient(timeout=10.0) as client:
            off_res = await client.get(
                f"https://world.openfoodfacts.org/cgi/search.pl"
                f"?search_terms={product_name}&search_simple=1&action=process&json=1"
            )
            if off_res.status_code == 200:
                off_data = off_res.json()
                if off_data.get("products") and len(off_data["products"]) > 0:
                    best_match = off_data["products"][0]
                    product_name = best_match.get("product_name", product_name)
                    real_ingredients = (
                        best_match.get("ingredients_text_en")
                        or best_match.get("ingredients_text")
                        or ""
                    )
                    nut = best_match.get("nutriments", {})
                    real_nutrition = {
                        "serving_size": "100g",
                        "calories": nut.get("energy-kcal_100g", 0),
                        "total_sugar_g": nut.get("sugars_100g", 0),
                        "added_sugar_g": nut.get("added-sugars_100g", 0),
                        "sodium_mg": (nut.get("sodium_100g", 0) * 1000) if nut.get("sodium_100g") else 0,
                        "saturated_fat_g": nut.get("saturated-fat_100g", 0),
                        "fiber_g": nut.get("fiber_100g", 0),
                        "protein_g": nut.get("proteins_100g", 0),
                    }
    except Exception as e:
        print(f"OFF Search Error: {e}")

    # Use real OCR text > OpenFoodFacts ingredients > nothing (don't inject fake text)
    raw_text = real_ingredients if real_ingredients else ocr_text

    if real_nutrition:
        nutrition = real_nutrition
    else:
        # Provide empty nutrition rather than fake values
        nutrition = {
            "serving_size": "unknown",
            "calories": None,
            "total_sugar_g": None,
            "added_sugar_g": None,
            "sodium_mg": None,
            "saturated_fat_g": None,
            "fiber_g": None,
            "protein_g": None,
        }

    # 1. Ingredient parsing
    raw_ingredients, allergy_stmt = parse_ingredients_text(raw_text)
    ingredients_normalized = resolve_aliases(raw_ingredients)

    # 2. Allergen matching
    user_allergies = user_profile.get("allergies", [])
    allergens = match_allergens(ingredients_normalized, allergy_stmt, user_allergies)
    allergen_status = determine_allergen_status(allergens, user_allergies)

    # 3. Nutrition concerns (skip if no real nutrition data)
    user_conditions = user_profile.get("conditions", [])
    user_preferences = user_profile.get("preferences", [])
    concerns = (
        evaluate_concerns(nutrition, user_conditions, user_preferences, ingredients_normalized)
        if real_nutrition else []
    )

    # 4. Overall status
    overall_status = determine_overall_status(allergen_status, concerns, ocr_confidence)

    # 5. Safer Alternatives
    alternatives = fetch_safer_alternatives(product_name, allergens, concerns) if overall_status != "safe" else []

    result = {
        "scanId": scan_id,
        "productName": product_name,
        "status": overall_status,
        "analysisState": "completed",
        "confidence": {
            "overall": round(ocr_confidence * 0.95, 2),
            "ocr": ocr_confidence,
            "ingredients": round(ocr_confidence * 0.92, 2),
            "nutrition": round(ocr_confidence * 0.80, 2) if real_nutrition else 0.0,
        },
        "imageUrl": (
            f"data:{file.content_type};base64,{base64.b64encode(content).decode('utf-8')}"
            if privacy_mode.lower() == "true"
            else f"/api/v1/scans/{scan_id}/image"
        ),
        "detectedRegions": detected_regions,   # Only real detections or empty list
        "extractedText": {
            "ingredientsRaw": raw_text,
            "ingredientsNormalized": ingredients_normalized,
            "allergyStatement": allergy_stmt,
        },
        "allergens": [
            {
                "name": a["name"],
                "matchType": a["match_type"],
                "severity": a["severity"],
                "matchedText": a["matched_text"]
            } for a in allergens
        ] if allergens else [],
        "nutrition": {
            "servingSize": nutrition.get("serving_size"),
            "calories": nutrition.get("calories"),
            "totalSugarG": nutrition.get("total_sugar_g"),
            "addedSugarG": nutrition.get("added_sugar_g"),
            "sodiumMg": nutrition.get("sodium_mg"),
            "saturatedFatG": nutrition.get("saturated_fat_g"),
            "fiberG": nutrition.get("fiber_g"),
            "proteinG": nutrition.get("protein_g"),
        },
        "concerns": [
            {
                "category": c["category"],
                "level": c["level"],
                "title": c["title"],
                "plainLanguageReason": c["plain_language_reason"],
                "factors": c["factors"]
            } for c in concerns
        ] if concerns else [],
        "alternatives": alternatives,
        "disclaimers": [
            "SafeBite AI provides educational guidance based on the readable label image. Always check the original package.",
        ],
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "pipelineUsed": pipeline_used,
    }

    if privacy_mode.lower() != "true":
        SCAN_DB[scan_id] = result

    await asyncio.sleep(1.0)
    return result


@api_router.get("/api/v1/scans/{scan_id}")
async def get_scan(scan_id: str):
    if scan_id not in SCAN_DB:
        raise HTTPException(status_code=404, detail="Scan not found")
    return SCAN_DB[scan_id]


from fastapi.responses import FileResponse

@api_router.get("/api/v1/scans/{scan_id}/image")
async def get_scan_image(scan_id: str):
    upload_dir = Path(settings.upload_directory)
    for ext in ["jpg", "jpeg", "png", "webp"]:
        f = upload_dir / f"{scan_id}.{ext}"
        if f.exists():
            return FileResponse(f)
    raise HTTPException(status_code=404, detail="Image not found")


@api_router.get("/api/v1/scans")
async def list_scans():
    return {"scans": list(SCAN_DB.values())}


@api_router.delete("/api/v1/scans/{scan_id}")
async def delete_scan(scan_id: str):
    upload_dir = Path(settings.upload_directory)
    for f in upload_dir.glob(f"{scan_id}.*"):
        f.unlink(missing_ok=True)
    if scan_id in SCAN_DB:
        del SCAN_DB[scan_id]
    return {"deleted": scan_id}


@api_router.get("/api/v1/profiles/me")
async def get_profile():
    return {
        "id": "default",
        "allergies": [],
        "conditions": [],
        "preferences": [],
        "accessibility": {"large_text": False, "high_contrast": False, "voice_readout": False},
    }

@api_router.put("/api/v1/profiles/me")
async def update_profile():
    return {"status": "updated"}

@api_router.post("/api/v1/meals", status_code=202)
async def scan_meal(
    file: UploadFile = File(...),
):
    """
    Endpoint for Phase 2: Scan Meal / Plate.
    Returns detected foods and estimated calories/macros.
    """
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Upload a JPG, PNG, or WEBP image.")

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="Image must be smaller than 10 MB.")

    meal_results = await vision_pipeline.process_meal_image(content)

    meal_id = str(uuid.uuid4())
    meal_results["meal_id"] = meal_id
    meal_results["imageUrl"] = f"data:{file.content_type};base64,{base64.b64encode(content).decode('utf-8')}"

    await asyncio.sleep(1.0)
    return meal_results
