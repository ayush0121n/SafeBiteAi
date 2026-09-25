import type { ScanResult } from "../api/types";

export const mockScanResult: ScanResult = {
  scanId: "123",
  productName: "Crunchy Granola Bar",
  status: "caution",
  analysisState: "completed",
  confidence: {
    overall: 0.89,
    ocr: 0.92,
    ingredients: 0.91,
    nutrition: 0.78,
  },
  extractedText: {
    ingredientsRaw:
      "Rolled Oats, Sugar, Palm Oil, Corn Syrup, Whey Powder, Salt, Soy Lecithin, Natural Flavour. May contain peanuts and tree nuts.",
    ingredientsNormalized: [
      "rolled oats",
      "sugar",
      "palm oil",
      "corn syrup",
      "whey powder",
      "salt",
      "soy lecithin",
      "natural flavour",
    ],
    allergyStatement: "May contain peanuts and tree nuts.",
  },
  allergens: [
    {
      name: "Milk",
      matchType: "ingredient",
      severity: "critical",
      matchedText: "Whey Powder",
    },
    {
      name: "Soy",
      matchType: "ingredient",
      severity: "warning",
      matchedText: "Soy Lecithin",
    },
    {
      name: "Peanuts",
      matchType: "may_contain",
      severity: "possible",
      matchedText: "May contain peanuts",
    },
  ],
  nutrition: {
    servingSize: "1 bar (35g)",
    calories: 170,
    totalSugarG: 12,
    addedSugarG: 9,
    sodiumMg: 180,
    saturatedFatG: 3.5,
    fiberG: 1,
    proteinG: 2,
  },
  concerns: [
    {
      category: "blood_sugar",
      level: "higher",
      title: "Added sugar found",
      plainLanguageReason:
        "This product has 9g of added sugar per serving. This may matter if you are trying to manage blood sugar.",
      factors: ["sugar", "corn syrup"],
    },
    {
      category: "heart_health",
      level: "moderate",
      title: "Saturated fat present",
      plainLanguageReason:
        "This product has 3.5g of saturated fat per serving from palm oil. Review if you have a heart-health goal.",
      factors: ["palm oil"],
    },
    {
      category: "blood_pressure",
      level: "lower",
      title: "Salt amount is moderate",
      plainLanguageReason:
        "Sodium is 180mg per serving. This is within a moderate range for most diets.",
      factors: ["salt"],
    },
  ],
  disclaimers: [
    "SafeBite AI provides educational guidance based on the readable label image. It may miss ingredients, serving details, translations, or cross-contact warnings.",
    "Always check the original package. For serious allergies or medical conditions, follow advice from your healthcare professional and emergency plan.",
  ],
  createdAt: new Date().toISOString(),
};

export const mockSafeScanResult: ScanResult = {
  scanId: "456",
  productName: "Plain Oat Milk",
  status: "safe",
  analysisState: "completed",
  confidence: { overall: 0.95, ocr: 0.97, ingredients: 0.96, nutrition: 0.88 },
  extractedText: {
    ingredientsRaw: "Water, Oats, Sunflower Oil, Sea Salt.",
    ingredientsNormalized: ["water", "oats", "sunflower oil", "sea salt"],
  },
  allergens: [],
  nutrition: {
    servingSize: "1 cup (240ml)",
    calories: 120,
    totalSugarG: 7,
    addedSugarG: 0,
    sodiumMg: 100,
    saturatedFatG: 0.5,
    fiberG: 2,
    proteinG: 3,
  },
  concerns: [],
  disclaimers: [
    "SafeBite AI provides educational guidance based on the readable label image. Always check the original package.",
  ],
  createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
};
