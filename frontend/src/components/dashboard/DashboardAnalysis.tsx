import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useScansStore } from "../../features/scans/scans.store";
import { useTrackerStore } from "../../features/tracker/tracker.store";

export function DashboardAnalysis() {
  const scans = useScansStore((s) => s.scans);
  const logs = useTrackerStore((s) => s.logs);

  const safeCount = scans.filter((s) => s.status === "safe").length;
  const cautionCount = scans.filter((s) => s.status === "caution").length;
  const avoidCount = scans.filter((s) => s.status === "avoid").length;

  const pieData = [
    { name: 'Safe', value: safeCount, color: '#4E9B69' },
    { name: 'Caution', value: cautionCount, color: '#E7A63F' },
    { name: 'Avoid', value: avoidCount, color: '#D95D59' },
  ].filter(d => d.value > 0);

  // Group logs by day for the line chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const lineData = last7Days.map(date => {
    const dayLogs = logs.filter(l => l.timestamp.startsWith(date));
    return {
      date: date.substring(5), // MM-DD
      calories: dayLogs.reduce((sum, l) => sum + (l.calories || 0), 0),
      protein: dayLogs.reduce((sum, l) => sum + (l.protein || 0), 0)
    };
  });

  if (scans.length === 0 && logs.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      {scans.length > 0 && (
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">Scan Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {logs.length > 0 && (
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">7-Day Macro Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="calories" stroke="#4E9B69" activeDot={{ r: 8 }} name="Calories" />
                <Line yAxisId="right" type="monotone" dataKey="protein" stroke="#687C8C" name="Protein (g)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
