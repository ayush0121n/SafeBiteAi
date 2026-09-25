# Future Label Region Detection

Current MVP uses full-image OCR.

## Future Detector Classes
- `ingredients_panel`
- `nutrition_facts_panel`
- `allergen_statement`

## Why YOLO is not enabled in MVP
- Requires labelled training images.
- A weak YOLO model can crop out important text and make OCR worse.
- YOLO default models (Ultralytics) are under AGPL-3.0, which requires careful license compliance.
- No medical decision can rely only on object detection.

## Requirements for Future Detector
A future model must be evaluated for:
- Detection accuracy on food-label images
- OCR improvement
- Latency
- Model size
- Deployment memory
- License compatibility
- Privacy implications

## Training Data Requirement
Training data requires a representative dataset of food labels.

## License and Dataset Validation
Requirement to verify model and dataset licenses before use. Keep SafeBite under its current license or intentionally migrate if needed.

## Evaluation
Requirement to compare detector-assisted OCR against baseline OCR.
