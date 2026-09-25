export type ConcernLevel = "lower" | "moderate" | "higher" | "unknown";
export type ScanStatus = "safe" | "caution" | "avoid" | "uncertain";
export type AnalysisState = "processing" | "completed" | "failed";
export type MatchType = "ingredient" | "contains_statement" | "may_contain";
export type Severity = "critical" | "warning" | "possible";

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

export interface AllergenMatch {
  name: string;
  matchType: MatchType;
  severity: Severity;
  matchedText: string;
}

export interface NutritionData {
  servingSize?: string;
  calories?: number;
  totalSugarG?: number;
  addedSugarG?: number;
  sodiumMg?: number;
  saturatedFatG?: number;
  fiberG?: number;
  proteinG?: number;
}

export interface Concern {
  category: string;
  level: ConcernLevel;
  title: string;
  plainLanguageReason: string;
  factors: string[];
}

export interface DetectedRegion {
  label: "ingredients_panel" | "nutrition_facts_panel" | "allergen_statement" | "unclear";
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
}

export interface ScanResult {
  scanId: string;
  productName?: string;
  status: ScanStatus;
  analysisState: AnalysisState;
  confidence: {
    overall: number;
    ocr: number;
    ingredients: number;
    nutrition: number;
  };
  imageUrl?: string;
  detectedRegions?: DetectedRegion[];
  extractedText: {
    ingredientsRaw?: string;
    ingredientsNormalized: string[];
    allergyStatement?: string;
  };
  allergens: AllergenMatch[];
  nutrition: NutritionData;
  concerns: Concern[];
  disclaimers: string[];
  createdAt: string;
}
