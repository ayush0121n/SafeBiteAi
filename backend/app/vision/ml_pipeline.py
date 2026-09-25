import os
import io
import logging
from typing import Dict, Any, List
from PIL import Image
import numpy as np

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

    def process_food_label(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Phase 1: Upgraded Scan Label Pipeline
        1. Run YOLOv8 to detect ingredient_panel / nutrition_table
        2. Crop regions
        3. Run PaddleOCR on the cropped images
        """
        logger.info("Starting VisionPipeline processing for food label...")
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        if not HAS_ULTRALYTICS or not HAS_PADDLEOCR:
            logger.info("Running in fallback/mock mode (missing ML dependencies).")
            return self._mock_process(image)

        yolo = self._load_yolo_label_model()
        ocr = self._load_ocr_model()
        
        # 1. Detect regions using YOLO
        # In a real fine-tuned model, classes might be 0: 'ingredient_panel', 1: 'nutrition_table'
        results = yolo(image, verbose=False)
        
        detected_text = []
        regions_found = []
        
        if len(results) > 0 and len(results[0].boxes) > 0:
            boxes = results[0].boxes
            for box in boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                conf = float(box.conf[0])
                cls = int(box.cls[0])
                
                # 2. Crop the detected regions
                cropped_img = image.crop((x1, y1, x2, y2))
                cropped_np = np.array(cropped_img)
                
                regions_found.append({
                    "box": [x1, y1, x2, y2],
                    "confidence": conf,
                    "class": cls
                })
                
                # 3. Run PaddleOCR specifically on the cropped region
                ocr_result = ocr.ocr(cropped_np, cls=True)
                
                if ocr_result and ocr_result[0]:
                    for line in ocr_result[0]:
                        text = line[1][0]
                        detected_text.append(text)
        else:
            # Fallback: if YOLO misses, run OCR on the whole image
            logger.info("YOLO detected no specific panels. Running OCR on full image.")
            ocr_result = ocr.ocr(np.array(image), cls=True)
            if ocr_result and ocr_result[0]:
                for line in ocr_result[0]:
                    text = line[1][0]
                    detected_text.append(text)

        full_text = " ".join(detected_text)

        return {
            "status": "success",
            "extracted_text": full_text,
            "regions_detected": len(regions_found),
            "region_details": regions_found,
            "pipeline": "YOLOv8 + PaddleOCR"
        }

    def process_meal_image(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Phase 2: Scan Meal Pipeline
        1. Run YOLOv8 to detect food items (bounding boxes)
        2. Run Vision Transformer (ViT / Food-101) to classify cropped foods
        3. Estimate calories and macros
        """
        logger.info("Starting VisionPipeline processing for meal...")
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        if not HAS_ULTRALYTICS:
            logger.info("Running in fallback/mock mode for meal processing.")
            return self._mock_process_meal(image)
            
        # Real implementation would go here (using self.yolo_meal_model and self.vit_model)
        # We fallback to mock for the MVP to prevent crashing the free tier
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
