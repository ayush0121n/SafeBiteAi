import os
import io
import logging
import re
import base64
import asyncio
from typing import Dict, Any, List

from PIL import Image, ImageEnhance, ImageOps
import numpy as np
import httpx

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
        self.yolo_label_model = None
        self.ocr_model = None

    def _load_yolo_label_model(self):
        if not HAS_ULTRALYTICS:
            return None
        if self.yolo_label_model is None:
            logger.info(f"Loading YOLOv8 model for label detection on {self.device}...")
            self.yolo_label_model = YOLO('yolov8n.pt')
        return self.yolo_label_model

    def _load_ocr_model(self):
        if not HAS_PADDLEOCR:
            return None
        if self.ocr_model is None:
            logger.info("Loading PaddleOCR model...")
            self.ocr_model = PaddleOCR(use_angle_cls=True, lang='en', use_gpu=(self.device == 'cuda'))
        return self.ocr_model

    def _preprocess_image(self, image: Image.Image) -> Image.Image:
        """
        Improve image quality before OCR.
        This significantly increases accuracy on real food labels.
        """
        # Convert to RGB
        image = image.convert("RGB")

        # Auto-contrast
        image = ImageOps.autocontrast(image, cutoff=2)

        # Increase contrast
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.4)

        # Slight sharpness
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(1.3)

        # Resize if too small or too large
        width, height = image.size
        max_side = max(width, height)

        if max_side < 900:
            # Upscale small images
            scale = 900 / max_side
            new_size = (int(width * scale), int(height * scale))
            image = image.resize(new_size, Image.Resampling.LANCZOS)
        elif max_side > 2000:
            # Downscale very large images
            scale = 1600 / max_side
            new_size = (int(width * scale), int(height * scale))
            image = image.resize(new_size, Image.Resampling.LANCZOS)

        return image

    async def process_food_label(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Phase 1: Improved Scan Label Pipeline
        Priority: Local YOLO+PaddleOCR → Hugging Face → Mock
        """
        logger.info("Starting VisionPipeline processing for food label...")

        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            image = self._preprocess_image(image)

            # Convert preprocessed image back to bytes for APIs
            buffered = io.BytesIO()
            image.save(buffered, format="JPEG", quality=92)
            processed_bytes = buffered.getvalue()
        except Exception as e:
            logger.error(f"Image preprocessing failed: {e}")
            processed_bytes = image_bytes
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # ---------- 1. Try local YOLO + PaddleOCR ----------
        yolo_model = self._load_yolo_label_model()
        ocr_model = self._load_ocr_model()

        if yolo_model and ocr_model:
            try:
                img_np = np.array(image)
                results = yolo_model(img_np)

                regions_details = []
                for r in results:
                    for box in r.boxes:
                        regions_details.append({
                            "box": box.xyxy[0].tolist(),
                            "confidence": float(box.conf[0]),
                            "class": int(box.cls[0])
                        })

                ocr_results = ocr_model.ocr(img_np, cls=True)
                extracted_text = ""
                if ocr_results and ocr_results[0]:
                    for line in ocr_results[0]:
                        if line and len(line) > 1 and line[1]:
                            extracted_text += line[1][0] + " "

                extracted_text = re.sub(r'\s+', ' ', extracted_text).strip()

                if len(extracted_text) > 25:
                    return {
                        "status": "success",
                        "extracted_text": extracted_text,
                        "regions_detected": len(regions_details),
                        "region_details": regions_details,
                        "pipeline": "YOLOv8 + PaddleOCR",
                        "is_mock": False
                    }
            except Exception as e:
                logger.error(f"Error in YOLO/OCR pipeline: {e}")

        # ---------- 2. Try Hugging Face OCR ----------
        from app.config import settings
        hf_token = settings.hugging_face_api_key

        if hf_token and hf_token not in ["", "your_hf_key_here", "hf_xxx"]:
            try:
                async with httpx.AsyncClient(timeout=35.0) as client:
                    for attempt in range(2):
                        response = await client.post(
                            "https://api-inference.huggingface.co/models/stepfun-ai/got-ocr2_0",
                            headers={
                                "Authorization": f"Bearer {hf_token}",
                                "Content-Type": "image/jpeg"
                            },
                            content=processed_bytes,
                        )

                        if response.status_code == 200:
                            result = response.json()
                            text = ""
                            if isinstance(result, list) and len(result) > 0:
                                text = result[0].get("generated_text", "")
                            elif isinstance(result, dict):
                                text = result.get("generated_text", "")

                            text = re.sub(r'\s+', ' ', text).strip()

                            if len(text) > 15:
                                return {
                                    "status": "success",
                                    "extracted_text": text,
                                    "regions_detected": 1,
                                    "region_details": [],
                                    "pipeline": "Hugging Face TrOCR",
                                    "is_mock": False
                                }
                            break # Success but short text, fallback
                        elif response.status_code == 503:
                            result = response.json()
                            wait_time = result.get("estimated_time", 10.0)
                            logger.info(f"HF OCR model loading. Waiting {wait_time}s...")
                            if wait_time > 15:
                                break
                            await asyncio.sleep(min(wait_time, 15))
                        else:
                            logger.warning(f"Hugging Face API error: {response.status_code} - {response.text}")
                            break

            except Exception as e:
                logger.error(f"Error in Hugging Face OCR: {e}")

        # ---------- 3. Try OCR.space API (Robust Full Document OCR) ----------
        import base64
        ocr_key = getattr(settings, "ocr_api_key", "")
        if ocr_key and ocr_key not in ["", "helloworld", "your_ocr_space_key"]:
            try:
                b64_img = base64.b64encode(processed_bytes).decode('utf-8')
                async with httpx.AsyncClient(timeout=25.0) as client:
                    response = await client.post(
                        "https://api.ocr.space/parse/image",
                        data={
                            "apikey": ocr_key,
                            "base64Image": f"data:image/jpeg;base64,{b64_img}",
                            "language": "eng",
                            "scale": "true",
                            "OCREngine": "2"
                        }
                    )
                    if response.status_code == 200:
                        ocr_result = response.json()
                        if not ocr_result.get("IsErroredOnProcessing", True) and ocr_result.get("ParsedResults"):
                            text = ocr_result["ParsedResults"][0].get("ParsedText", "")
                            text = re.sub(r'\s+', ' ', text).strip()
                            if len(text) > 25:
                                return {
                                    "status": "success",
                                    "extracted_text": text,
                                    "regions_detected": 1,
                                    "region_details": [],
                                    "pipeline": "OCR.space API",
                                    "is_mock": False
                                }
                    else:
                        logger.warning(f"OCR.space API error: {response.status_code} - {response.text}")
            except Exception as e:
                logger.error(f"Error in OCR.space API: {e}")
        else:
            logger.info("Skipping OCR.space API because no valid key was provided in settings.")

        # ---------- 4. Fallback to Mock ----------
        logger.info("Falling back to Mock Mode")
        return self._mock_process(image)

    async def process_meal_image(self, image_bytes: bytes) -> Dict[str, Any]:
        """Meal pipeline (kept similar, with preprocessing)"""
        logger.info("Starting VisionPipeline processing for meal...")

        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            image = self._preprocess_image(image)
            buffered = io.BytesIO()
            image.save(buffered, format="JPEG", quality=90)
            processed_bytes = buffered.getvalue()
        except Exception:
            processed_bytes = image_bytes
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        yolo_model = self._load_yolo_label_model()

        if yolo_model:
            try:
                img_np = np.array(image)
                results = yolo_model(img_np)
                foods_list = []
                total_nut = {"calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}
                names = yolo_model.names
                food_classes = {46, 47, 48, 49, 50, 51, 52, 53, 54, 55}
                detected_items = []

                for r in results:
                    for box in r.boxes:
                        cls = int(box.cls[0])
                        conf = float(box.conf[0])
                        if cls in food_classes and conf > 0.25:
                            label = names.get(cls, "Food Item")
                            detected_items.append({
                                "label": label.title(),
                                "score": conf,
                                "box": box.xyxy[0].tolist()
                            })

                if detected_items:
                    from app.services.nutrition_service import fetch_nutrition_for_food
                    tasks = [fetch_nutrition_for_food(item["label"]) for item in detected_items]
                    nutrition_results = await asyncio.gather(*tasks)

                    for item, nut in zip(detected_items, nutrition_results):
                        if not nut:
                            nut = {"calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0, "serving_g": 100}

                        foods_list.append({
                            "name": item["label"],
                            "confidence": round(item["score"], 2),
                            "box": item["box"],
                            "nutrition": nut
                        })
                        total_nut["calories"] += nut.get("calories", 0)
                        total_nut["protein_g"] += nut.get("protein_g", 0)
                        total_nut["carbs_g"] += nut.get("carbs_g", 0)
                        total_nut["fat_g"] += nut.get("fat_g", 0)

                    return {
                        "status": "success",
                        "foods": foods_list,
                        "total_nutrition": total_nut,
                        "pipeline": "YOLOv8 + USDA API",
                        "is_mock": False
                    }
            except Exception as e:
                logger.error(f"Error in YOLO meal pipeline: {e}")

        # Hugging Face fallback for meals
        from app.config import settings
        hf_token = settings.hugging_face_api_key

        if hf_token and hf_token not in ["", "your_hf_key_here"]:
            try:
                async with httpx.AsyncClient(timeout=25.0) as client:
                    for attempt in range(2):
                        response = await client.post(
                            "https://api-inference.huggingface.co/models/nateraw/food",
                            headers={"Authorization": f"Bearer {hf_token}"},
                            content=processed_bytes,
                        )
                        if response.status_code == 200:
                            predictions = response.json()
                            if isinstance(predictions, list) and predictions:
                                top_preds = [p for p in predictions if p.get('score', 0) > 0.15][:3]
                                if top_preds:
                                    from app.services.nutrition_service import fetch_nutrition_for_food
                                    foods_list = []
                                    total_nut = {"calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}

                                    for p in top_preds:
                                        label = p.get('label', '').replace('_', ' ').title()
                                        nut = await fetch_nutrition_for_food(label) or {
                                            "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0
                                        }
                                        foods_list.append({
                                            "name": label,
                                            "confidence": round(p.get('score', 0), 2),
                                            "box": [0, 0, 0, 0],
                                            "nutrition": nut
                                        })
                                        total_nut["calories"] += nut.get("calories", 0)
                                        total_nut["protein_g"] += nut.get("protein_g", 0)
                                        total_nut["carbs_g"] += nut.get("carbs_g", 0)
                                        total_nut["fat_g"] += nut.get("fat_g", 0)

                                    return {
                                        "status": "success",
                                        "foods": foods_list,
                                        "total_nutrition": total_nut,
                                        "pipeline": "Hugging Face Food Classifier",
                                        "is_mock": False
                                    }
                            break
                        elif response.status_code == 503:
                            result = response.json()
                            wait_time = result.get("estimated_time", 10.0)
                            logger.info(f"HF Food model loading. Waiting {wait_time}s...")
                            if wait_time > 15:
                                break
                            await asyncio.sleep(min(wait_time, 15))
                        else:
                            logger.warning(f"Hugging Face API meal error: {response.status_code} - {response.text}")
                            break
            except Exception as e:
                logger.error(f"HF meal error: {e}")

        return self._mock_process_meal(image)

    def _mock_process(self, image: Image.Image) -> Dict[str, Any]:
        return {
            "status": "success",
            "extracted_text": "Ingredients: Water, Sugar, Salt, Natural Flavors. Contains: Milk. Nutrition Facts: Calories 120, Total Fat 2g, Sodium 180mg, Total Carbohydrate 24g, Protein 1g.",
            "regions_detected": 1,
            "region_details": [],
            "pipeline": "Mock Mode (Simulated Label Text)",
            "is_mock": True
        }

    def _mock_process_meal(self, image: Image.Image) -> Dict[str, Any]:
        return {
            "status": "success",
            "foods": [],
            "total_nutrition": {"calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0},
            "pipeline": "Mock Mode (ML libraries unavailable)",
            "is_mock": True
        }


vision_pipeline = VisionPipeline()
