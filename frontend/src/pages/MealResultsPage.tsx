import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, Utensils, Flame, Info } from "lucide-react";

export function MealResultsPage() {
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No Result Found</h2>
        <Link to="/app/scan" className="text-[var(--color-primary)] font-bold">Go back and scan</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 animate-fade-in space-y-6">
      <Link to="/app/scan" className="text-[var(--color-muted)] hover:text-[var(--color-text)] font-bold flex items-center gap-2 mb-6 text-sm">
        <ArrowLeft size={16} /> Back to Scanner
      </Link>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-3xl shadow-sm text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Utensils size={32} className="text-orange-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--color-text)] mb-2 capitalize">
          {result.detected_food || "Meal Detected"}
        </h1>
        <p className="text-[var(--color-muted)]">Estimated macros based on visual analysis</p>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
          <Flame className="text-orange-500" /> Nutritional Breakdown
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[var(--color-bg)] p-4 rounded-xl text-center border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-muted)] mb-1">Calories</p>
            <p className="text-2xl font-bold text-[var(--color-text)]">{result.macros?.calories || 0}</p>
          </div>
          <div className="bg-[var(--color-bg)] p-4 rounded-xl text-center border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-muted)] mb-1">Protein</p>
            <p className="text-2xl font-bold text-blue-500">{result.macros?.protein || 0}g</p>
          </div>
          <div className="bg-[var(--color-bg)] p-4 rounded-xl text-center border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-muted)] mb-1">Carbs</p>
            <p className="text-2xl font-bold text-green-500">{result.macros?.carbs || 0}g</p>
          </div>
          <div className="bg-[var(--color-bg)] p-4 rounded-xl text-center border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-muted)] mb-1">Fat</p>
            <p className="text-2xl font-bold text-orange-500">{result.macros?.fat || 0}g</p>
          </div>
        </div>
      </div>

      {result.allergens && result.allergens.length > 0 ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
          <h3 className="font-bold text-red-700 mb-2">⚠️ Potential Allergens Detected</h3>
          <ul className="list-disc list-inside text-red-600">
            {result.allergens.map((a: string, i: number) => <li key={i}>{a}</li>)}
          </ul>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-3">
          <Info className="text-green-600" />
          <p className="font-bold text-green-700 text-sm">No apparent allergens detected in this image.</p>
        </div>
      )}
    </div>
  );
}
