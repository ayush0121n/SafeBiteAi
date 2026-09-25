import { useTrackerStore } from "../../features/tracker/tracker.store";
import { Trash2, TrendingUp, Calendar } from "lucide-react";

export function DailyTracker() {
  const { logs, goals, removeLog } = useTrackerStore();

  // Filter logs for today
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
        <h4 className="font-bold text-[var(--color-text)] mb-3 text-sm uppercase tracking-wider text-[var(--color-muted)]">Logged Items</h4>
        {todayLogs.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)] text-center py-4 bg-[var(--color-bg)] rounded-xl border border-dashed border-[var(--color-border)]">
            No items logged today. Scan a label or meal to add one!
          </p>
        ) : (
          <div className="space-y-3">
            {todayLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
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
