import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { useState } from "react";
import { useTrackerStore } from "../features/tracker/tracker.store";

export function MealResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const addLog = useTrackerStore((s) => s.addLog);
  const [added, setAdded] = useState(false);

  const result = state?.result;

  if (!result) {
    return (
      <div className="p-6 text-center">
        <p>No results found.</p>
        <button onClick={() => navigate("/app/scan")} className="text-blue-500 underline mt-4">Go back</button>
      </div>
    );
  }

  const { foods, total_nutrition, imageUrl } = result;

  const handleAddLog = () => {
    // Add all detected foods as a single meal log or individual logs
    // We'll log it as a combined meal for simplicity
    addLog({
      name: foods.map((f: any) => f.name).join(" + "),
      calories: total_nutrition.calories,
      protein: total_nutrition.protein_g,
      carbs: total_nutrition.carbs_g,
      fat: total_nutrition.fat_g
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Scanner
      </button>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
        {imageUrl && (
          <div className="bg-gray-100 p-4 border-b border-[var(--color-border)] text-center">
            <img src={imageUrl} alt="Meal" className="max-h-[300px] mx-auto rounded-lg shadow-sm" />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-1">Meal Detected</h2>
              <p className="text-[var(--color-muted)]">Found {foods?.length || 0} items</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-[var(--color-primary)]">{Math.round(total_nutrition.calories)}</p>
              <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider">kcal</p>
            </div>
          </div>

          <div className="flex gap-4 mb-8 text-center border-y border-[var(--color-border)] py-4">
            <div className="flex-1">
              <p className="text-lg font-bold text-blue-600">{Math.round(total_nutrition.protein_g)}g</p>
              <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider">Protein</p>
            </div>
            <div className="flex-1 border-x border-[var(--color-border)]">
              <p className="text-lg font-bold text-green-600">{Math.round(total_nutrition.carbs_g)}g</p>
              <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider">Carbs</p>
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-orange-600">{Math.round(total_nutrition.fat_g)}g</p>
              <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider">Fat</p>
            </div>
          </div>

          <h3 className="font-bold text-[var(--color-text)] mb-3 text-sm uppercase tracking-wider text-[var(--color-muted)]">Detected Items</h3>
          <div className="space-y-3 mb-8">
            {foods?.map((food: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                <div>
                  <p className="font-bold text-[var(--color-text)] flex items-center gap-2">
                    {food.name}
                    <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                      {Math.round(food.confidence * 100)}% Match
                    </span>
                  </p>
                  <p className="text-xs text-[var(--color-muted)] mt-1">
                    {food.nutrition.serving_g}g serving
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--color-text)]">{Math.round(food.nutrition.calories)} kcal</p>
                  <p className="text-[10px] text-[var(--color-muted)] font-medium">
                    P:{Math.round(food.nutrition.protein_g)} C:{Math.round(food.nutrition.carbs_g)} F:{Math.round(food.nutrition.fat_g)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddLog}
            disabled={added}
            className={`w-full flex justify-center items-center gap-2 py-4 rounded-xl text-white font-bold shadow-md transition-all ${
              added ? "bg-green-500" : "gradient-primary hover:shadow-lg"
            }`}
          >
            {added ? (
              <><Check size={20} /> Added to Today's Log</>
            ) : (
              <><Plus size={20} /> Add to Today's Log</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
