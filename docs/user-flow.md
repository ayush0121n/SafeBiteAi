# User Flow

## First use
Landing page → Onboarding → Select allergies, health goals, and preferences → Select accessibility settings → Dashboard

## Scan flow
Dashboard → Upload label photo → Preview image → Analyze → Processing state → Results → Save to history or safe-food list

## Result states
- Safe: No configured critical concern found in readable text
- Caution: Nutrition or preference-related concern found
- Avoid: Matched user-selected allergen or strict avoidance rule
- Uncertain: Image quality, OCR, or text extraction is insufficient

## Error flow
Upload image → Unsupported format or size error → Blurry / unreadable warning → Retry upload → Optional manual text review later
