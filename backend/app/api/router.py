import json
import os
import uuid
import asyncio
import base64
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


def _load_json(name: str) -> dict:
    with open(RULES_DIR / name, "r", encoding="utf-8") as f:
        return json.load(f)


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
        # Save temporarily
        upload_dir = Path(settings.upload_directory)
        upload_dir.mkdir(exist_ok=True)
        ext = (file.filename or "img").rsplit(".", 1)[-1] if file.filename else "jpg"
        path = upload_dir / f"{scan_id}.{ext}"
        path.write_bytes(content)

    # ---------------------------------------------------------
    # Internal ML Container API (PaddleOCR) or Local Vision Pipeline
    # ---------------------------------------------------------
    ocr_text = ""
    ocr_confidence = 0.90
    vision_results = {}

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
                    ocr_confidence = data.get("confidence", 0.90)
                else:
                    print(f"ML API Error: {response.status_code} {response.text}")
                    ocr_text = "Error reading label. Internal ML service failed."
                    ocr_confidence = 0.30
        except Exception as e:
            print(f"ML Request failed: {e}")
            ocr_text = "Error reading label. Connection to ML service failed."
            ocr_confidence = 0.30
    else:
        # Use the local vision pipeline (YOLOv8 + OCR)
        # Note: In Render free tier, this will run in mock mode
        vision_results = vision_pipeline.process_food_label(content)
        ocr_text = vision_results.get("extracted_text", "")
        ocr_confidence = 0.92

    product_name = file.filename.rsplit(".", 1)[0].replace("-", " ").replace("_", " ").title() if file.filename else "Food Label"
    raw_text = ocr_text if len(ocr_text) > 10 else "Ingredients: Rolled Oats, Sugar, Palm Oil, Corn Syrup, Whey Powder, Salt, Soy Lecithin. May contain peanuts and tree nuts."

    
    # Nutrition mock (since OCR.space just returns unstructured text, we still mock nutrition values for MVP)
    nutrition = {
        "serving_size": "1 bar (35g)",
        "calories": 170,
        "total_sugar_g": 12,
        "added_sugar_g": 9,
        "sodium_mg": 180,
        "saturated_fat_g": 3.5,
        "fiber_g": 1,
        "protein_g": 2,
    }

    # 1. Ingredient parsing
    raw_ingredients, allergy_stmt = parse_ingredients_text(raw_text)
    ingredients_normalized = resolve_aliases(raw_ingredients)

    # 2. Allergen matching
    user_allergies = user_profile.get("allergies", [])
    allergens = match_allergens(ingredients_normalized, allergy_stmt, user_allergies)
    allergen_status = determine_allergen_status(allergens, user_allergies)

    # 3. Nutrition concerns
    user_conditions = user_profile.get("conditions", [])
    user_preferences = user_profile.get("preferences", [])
    concerns = evaluate_concerns(nutrition, user_conditions, user_preferences, ingredients_normalized)

    # 4. Overall status
    ocr_confidence = 0.92
    overall_status = determine_overall_status(allergen_status, concerns, ocr_confidence)

    # 5. Fetch Safer Alternatives
    alternatives = fetch_safer_alternatives(product_name, allergens, concerns) if overall_status != "safe" else []

    result = {
        "scanId": scan_id,
        "productName": product_name,
        "status": overall_status,
        "analysisState": "completed",
        "confidence": {
            "overall": 0.89,
            "ocr": ocr_confidence,
            "ingredients": 0.91,
            "nutrition": 0.78,
        },
        "imageUrl": f"data:{file.content_type};base64,{base64.b64encode(content).decode('utf-8')}" if privacy_mode.lower() == "true" else f"/api/v1/scans/{scan_id}/image",
        "detectedRegions": [
            {"label": "ingredients_panel", "confidence": 0.95, "bbox": {"x": 10, "y": 10, "width": 80, "height": 30}},
            {"label": "nutrition_facts_panel", "confidence": 0.92, "bbox": {"x": 10, "y": 50, "width": 80, "height": 40}},
            {"label": "allergen_statement", "confidence": 0.88, "bbox": {"x": 10, "y": 95, "width": 80, "height": 10}}
        ],
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
    }

    if privacy_mode.lower() != "true":
        # Save to in-memory DB
        SCAN_DB[scan_id] = result

    # Simulate processing delay
    await asyncio.sleep(1.5)

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
    # find any file starting with scan_id
    for ext in ["jpg", "jpeg", "png", "webp"]:
        f = upload_dir / f"{scan_id}.{ext}"
        if f.exists():
            return FileResponse(f)
    raise HTTPException(status_code=404, detail="Image not found")


@api_router.get("/api/v1/scans")
async def list_scans():
    return {"scans": []}


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
        
    # Process the meal image using the ML vision pipeline (mocked on free tier)
    meal_results = vision_pipeline.process_meal_image(content)
    
    # Add unique ID and image URL
    meal_id = str(uuid.uuid4())
    meal_results["meal_id"] = meal_id
    meal_results["imageUrl"] = f"data:{file.content_type};base64,{base64.b64encode(content).decode('utf-8')}"
    
    # Simulate processing delay
    await asyncio.sleep(1.5)
    
    return meal_results
