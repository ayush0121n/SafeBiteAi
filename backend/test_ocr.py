import asyncio
from app.vision.ml_pipeline import vision_pipeline

async def main():
    with open('uploads/000f09c4-be35-42ac-af14-69aa23fb9251.png', 'rb') as f:
        content = f.read()
    
    result = await vision_pipeline.process_food_label(content)
    print("OCR Result:", result)

asyncio.run(main())
