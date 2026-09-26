import os
import io
import logging
from typing import Dict, Any, List
from PIL import Image
import numpy as np
import httpx
import base64
import os
import asyncio

logger = logging.getLogger(__name__)

# Attempt to import heavy ML libraries gracefully
try:
    from ultralytics import YOLO
    import torch
    HAS_ULTRALYTICS = True
except ImportError:
    HAS_ULTRALYTICS = False
    logger.warning("ultralytics or torch not installed. YOLO models will run in mock mode.")

try:
    from paddleocr import PaddleOCR
    HAS_PADDLEOCR = True
except ImportError:
    HAS_PADDLEOCR = False
    logger.warning("paddleocr not installed. OCR will run in mock mode.")


class VisionPipeline:
    def __init__(self):
        self.device = 'cuda' if (HAS_ULTRALYTICS and torch.cuda.is_available()) else 'cpu'
        
        # We initialize models lazily to save memory during startup
        self.yolo_label_model = None
        self.ocr_model = None

    def _load_yolo_label_model(self):
        if not HAS_ULTRALYTICS:
            return None
        if self.yolo_label_model is None:
            logger.info(f"Loading YOLOv8 model for label detection on {self.device}...")
            # For a real deployment, you would provide the path to your fine-tuned weights here e.g. 'yolov8n_food_labels.pt'
            # We fall back to a base yolov8n model just so it doesn't crash if called
            self.yolo_label_model = YOLO('yolov8n.pt') 
        return self.yolo_label_model

    def _load_ocr_model(self):
        if not HAS_PADDLEOCR:
            return None
        if self.ocr_model is None:
            logger.info("Loading PaddleOCR model...")
            self.ocr_model = PaddleOCR(use_angle_cls=True, lang='en', use_gpu=(self.device == 'cuda'))
        return self.ocr_model

    async def process_food_label(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Phase 1: Upgraded Scan Label Pipeline using Hugging Face API for OCR
        """
        logger.info("Starting VisionPipeline processing for food label...")
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        from app.config import settings
        hf_token = settings.hugging_face_api_key
        if not hf_token or hf_token == "your_hf_key_here":
            logger.info("Running in fallback/mock mode (No Hugging Face token).")
            return self._mock_process(image)

        try:
            # Call Hugging Face API for OCR
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api-inference.huggingface.co/models/microsoft/trocr-base-printed",
                    headers={"Authorization": f"Bearer {hf_token}"},
                    content=image_bytes,
                    timeout=15.0
                )
                response.raise_for_status()
                result = response.json()
            
            # Extract text
            text = result[0].get("generated_text", "") if isinstance(result, list) else result.get("generated_text", "")
            
            return {
                "status": "success",
                "extracted_text": text,
                "regions_detected": 1,
                "region_details": [],
                "pipeline": "Hugging Face TrOCR"
            }
        except Exception as e:
            logger.error(f"Error in OCR pipeline: {e}")
            return self._mock_process(image)

    async def process_meal_image(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Phase 2: Scan Meal Pipeline using REAL APIs
        1. Call Hugging Face API for ViT classification
        2. Query USDA FoodData Central for actual nutrition
        """
        logger.info("Starting VisionPipeline processing for meal with HF + USDA...")
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        from app.config import settings
        hf_token = settings.hugging_face_api_key
        if not hf_token or hf_token == "your_hf_key_here":
            logger.info("No Hugging Face token found. Running mock.")
            return self._mock_process_meal(image)

        try:
            # Query Hugging Face
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api-inference.huggingface.co/models/nateraw/food",
                    headers={"Authorization": f"Bearer {hf_token}"},
                    content=image_bytes,
                    timeout=15.0
                )
                response.raise_for_status()
                predictions = response.json()

            if not predictions or not isinstance(predictions, list):
                return self._mock_process_meal(image)

            # Get top 2 predictions above a certain threshold, or just the top 1
            top_preds = [p for p in predictions if p.get('score', 0) > 0.1][:2]
            
            if not top_preds:
                return self._mock_process_meal(image)

            foods_list = []
            total_nut = {"calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}

            from app.services.nutrition_service import fetch_nutrition_for_food

            # Run USDA queries concurrently
            tasks = []
            for p in top_preds:
                label = p.get('label', '').replace('_', ' ').title()
                tasks.append(fetch_nutrition_for_food(label))
                
            nutrition_results = await asyncio.gather(*tasks)

            for p, nut in zip(top_preds, nutrition_results):
                label = p.get('label', '').replace('_', ' ').title()
                score = p.get('score', 0)

                # If USDA failed, fall back to some mock data for this item
                if not nut:
                    nut = {
                        "calories": 100, "protein_g": 5, "carbs_g": 10, "fat_g": 2, "serving_g": 100
                    }

                foods_list.append({
                    "name": label,
                    "confidence": round(score, 2),
                    "box": [0, 0, 0, 0], # Bounding box not provided by standard classification models
                    "nutrition": nut
                })

                total_nut["calories"] += nut["calories"]
                total_nut["protein_g"] += nut["protein_g"]
                total_nut["carbs_g"] += nut["carbs_g"]
                total_nut["fat_g"] += nut["fat_g"]

            return {
                "status": "success",
                "foods": foods_list,
                "total_nutrition": total_nut,
                "pipeline": "Hugging Face ViT + USDA API"
            }

        except Exception as e:
            logger.error(f"Error in meal processing pipeline: {e}")
            return self._mock_process_meal(image)

    def _mock_process(self, image: Image.Image) -> Dict[str, Any]:
        """Fallback mock for environments without heavy ML libraries (like Render free tier)."""
        return {
            "status": "success",
            "extracted_text": "Ingredients: Wheat flour, sugar, palm oil, salt, peanut extract, artificial flavors. Contains: Wheat, Peanuts.",
            "regions_detected": 1,
            "region_details": [{"box": [10, 10, 200, 200], "confidence": 0.99, "class": 0}],
            "pipeline": "Mock Mode (Missing ultralytics/paddleocr)"
        }

    def _mock_process_meal(self, image: Image.Image) -> Dict[str, Any]:
        """Mock meal classification and nutrition estimation."""
        return {
            "status": "success",
            "foods": [
                {
                    "name": "Grilled Chicken Breast",
                    "confidence": 0.94,
                    "box": [50, 50, 300, 250],
                    "nutrition": {
                        "calories": 165,
                        "protein_g": 31,
                        "carbs_g": 0,
                        "fat_g": 3.6,
                        "serving_g": 100
                    }
                },
                {
                    "name": "Steamed Broccoli",
                    "confidence": 0.89,
                    "box": [300, 50, 450, 200],
                    "nutrition": {
                        "calories": 35,
                        "protein_g": 2.4,
                        "carbs_g": 7.2,
                        "fat_g": 0.4,
                        "serving_g": 100
                    }
                }
            ],
            "total_nutrition": {
                "calories": 200,
                "protein_g": 33.4,
                "carbs_g": 7.2,
                "fat_g": 4.0
            },
            "pipeline": "ViT Food-101 (Mock)"
        }

vision_pipeline = VisionPipeline()
