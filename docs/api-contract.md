# SafeBite AI API Contract

## Upload food-label image
POST /api/v1/scans
Content-Type: multipart/form-data

Fields:
- file: JPG, PNG, or WEBP image
- profile_id: user profile ID

Response: 202 Accepted
```json
{
  "scan_id": "scan_123",
  "status": "processing"
}
```

## Retrieve scan status and result
GET /api/v1/scans/{scan_id}

```json
{
  "scan_id": "scan_123",
  "analysis_state": "completed",
  "result": {
    "status": "caution",
    "confidence": {
      "overall": 0.89,
      "ocr": 0.92,
      "ingredients": 0.91,
      "nutrition": 0.78
    }
  }
}
```

## Update profile
PUT /api/v1/profiles/me

```json
{
  "allergies": ["peanut", "milk"],
  "conditions": ["hypertension"],
  "preferences": ["low_sodium"],
  "accessibility": {
    "largeText": true,
    "highContrast": false,
    "voiceReadout": false
  }
}
```
