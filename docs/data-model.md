# Core Data Model

## User profile
```ts
export interface UserProfile {
  id: string;
  name?: string;
  ageGroup?: "child" | "teen" | "adult" | "senior";
  allergies: string[];
  conditions: Array<
    "diabetes" | "hypertension" | "heart_health" | "celiac" | "kidney_health"
  >;
  preferences: Array<
    "low_sugar" | "low_sodium" | "low_saturated_fat" | "vegan" | "vegetarian"
  >;
  accessibility: {
    largeText: boolean;
    highContrast: boolean;
    voiceReadout: boolean;
  };
}
```

## Scan result
```ts
export interface ScanResult {
  scanId: string;
  status: "safe" | "caution" | "avoid" | "uncertain";
  analysisState: "processing" | "completed" | "failed";
  confidence: {
    overall: number;
    ocr: number;
    ingredients: number;
    nutrition: number;
  };
  imageUrl?: string;
  extractedText: {
    ingredientsRaw?: string;
    ingredientsNormalized: string[];
    allergyStatement?: string;
  };
  allergens: Array<{
    name: string;
    matchType: "ingredient" | "contains_statement" | "may_contain";
    severity: "critical" | "warning" | "possible";
    matchedText: string;
  }>;
  nutrition: {
    servingSize?: string;
    calories?: number;
    totalSugarG?: number;
    addedSugarG?: number;
    sodiumMg?: number;
    saturatedFatG?: number;
    fiberG?: number;
    proteinG?: number;
  };
  concerns: Array<{
    category: string;
    level: "lower" | "moderate" | "higher" | "unknown";
    title: string;
    plainLanguageReason: string;
    factors: string[];
  }>;
  createdAt: string;
}
```
