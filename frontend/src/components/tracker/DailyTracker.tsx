import { useEffect, useState } from "react";
import { useTrackerStore } from "../../features/tracker/tracker.store";
import { Trash2, Calendar, Plus, X } from "lucide-react";

export function DailyTracker() {
  const { logs, goals, removeLog, addLog, loadSupabaseData } = useTrackerStore();
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [manualForm, setManualForm] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "" });

  useEffect(() => {
    loadSupabaseData();
  }, [loadSupabaseData]);

  const today = new Date().toDateString();
  const todayLogs = logs.filter((l) => new Date(l.timestamp).toDateString() === today);

  const totals = todayLogs.reduce(
    (acc, log) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + log.protein,
      carbs: acc.carbs + log.carbs,
      fat: acc.fat + log.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const getPercent = (val: number, goal: number) => Math.min(100, Math.round((val / goal) * 100));

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.name) return;

    let cal = Number(manualForm.calories) || 0;
    let pro = Number(manualForm.protein) || 0;
    let car = Number(manualForm.carbs) || 0;
    let ft = Number(manualForm.fat) || 0;

    // Simulate API / Database lookup if user only provided the name
    if (cal === 0 && pro === 0 && car === 0 && ft === 0) {
      const name = manualForm.name.toLowerCase();
      if (name.includes("milk")) { cal = 103; pro = 8; car = 12; ft = 2.4; }
      else if (name.includes("egg")) { cal = 78; pro = 6; car = 0.6; ft = 5; }
      else if (name.includes("chicken")) { cal = 165; pro = 31; car = 0; ft = 3.6; }
      else if (name.includes("rice")) { cal = 205; pro = 4; car = 45; ft = 0.4; }
      else if (name.includes("bread")) { cal = 79; pro = 3; car = 15; ft = 1; }
      else if (name.includes("apple")) { cal = 95; pro = 0.5; car = 25; ft = 0.3; }
      else if (name.includes("banana")) { cal = 105; pro = 1.3; car = 27; ft = 0.4; }
      else {
        // Generic fallback average if not in mock DB
        cal = 150; pro = 5; car = 15; ft = 5;
      }
    }
    
    await addLog({
      name: manualForm.name,
      calories: cal,
      protein: pro,
      carbs: car,
      fat: ft,
    });
    
    setIsAddingManual(false);
    setManualForm({ name: "", calories: "", protein: "", carbs: "", fat: "" });
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
          <Calendar size={20} className="text-[var(--color-primary)]" />
          Today's Log
        </h3>
        <p className="text-sm font-bold text-[var(--color-primary)]">
          {totals.calories} / {goals.calories} kcal
        </p>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 mb-8">
        {[
          { label: "Protein", val: totals.protein, goal: goals.protein, color: "bg-blue-500" },
          { label: "Carbs", val: totals.carbs, goal: goals.carbs, color: "bg-green-500" },
          { label: "Fat", val: totals.fat, goal: goals.fat, color: "bg-orange-500" },
        ].map((m) => (
          <div key={m.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-[var(--color-text)]">{m.label}</span>
              <span className="text-[var(--color-muted)] text-xs">
                {Math.round(m.val)}g / {m.goal}g
              </span>
            </div>
            <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div 
                className={`h-full ${m.color} transition-all duration-500 ease-out`} 
                style={{ width: `${getPercent(m.val, m.goal)}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Log List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-[var(--color-text)] text-sm uppercase tracking-wider text-[var(--color-muted)]">Logged Items</h4>
          <button 
            onClick={() => setIsAddingManual(!isAddingManual)}
            className="text-xs font-bold flex items-center gap-1 text-[var(--color-primary)] hover:underline"
          >
            {isAddingManual ? <><X size={14}/> Cancel</> : <><Plus size={14}/> Add Manual</>}
          </button>
        </div>

        {isAddingManual && (
          <form onSubmit={handleManualSubmit} className="mb-4 p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl animate-fade-in space-y-3">
            <input 
              type="text" required placeholder="Food Name" 
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm"
              value={manualForm.name} onChange={(e) => setManualForm({...manualForm, name: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Calories" className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm"
                value={manualForm.calories} onChange={(e) => setManualForm({...manualForm, calories: e.target.value})} />
              <input type="number" placeholder="Protein (g)" className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm"
                value={manualForm.protein} onChange={(e) => setManualForm({...manualForm, protein: e.target.value})} />
              <input type="number" placeholder="Carbs (g)" className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm"
                value={manualForm.carbs} onChange={(e) => setManualForm({...manualForm, carbs: e.target.value})} />
              <input type="number" placeholder="Fat (g)" className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm"
                value={manualForm.fat} onChange={(e) => setManualForm({...manualForm, fat: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-[var(--color-primary)] text-white py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
              Save Entry
            </button>
          </form>
        )}

        {todayLogs.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)] text-center py-4 bg-[var(--color-bg)] rounded-xl border border-dashed border-[var(--color-border)]">
            No items logged today. Scan a label or meal to add one!
          </p>
        ) : (
          <div className="space-y-3">
            {todayLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] animate-fade-in">
                <div>
                  <p className="font-bold text-[var(--color-text)] text-sm">{log.name}</p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {Math.round(log.calories)} kcal • P: {Math.round(log.protein)}g C: {Math.round(log.carbs)}g F: {Math.round(log.fat)}g
                  </p>
                </div>
                <button 
                  onClick={() => removeLog(log.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete log"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
