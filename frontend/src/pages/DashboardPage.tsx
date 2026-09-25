import { Link } from "react-router-dom";
import { Upload, ShieldCheck, ShieldAlert, ShieldX, HelpCircle, TrendingUp, Clock } from "lucide-react";
import { useScansStore } from "../features/scans/scans.store";
import { useProfileStore } from "../features/profile/profile.store";
import type { ScanStatus } from "../api/types";

const statusConfig: Record<ScanStatus, { Icon: typeof ShieldCheck; color: string; label: string }> = {
  safe: { Icon: ShieldCheck, color: "text-[var(--color-safe)]", label: "Safe" },
  caution: { Icon: ShieldAlert, color: "text-[var(--color-caution)]", label: "Caution" },
  avoid: { Icon: ShieldX, color: "text-[var(--color-avoid)]", label: "Avoid" },
  uncertain: { Icon: HelpCircle, color: "text-[var(--color-uncertain)]", label: "Uncertain" },
};

export function DashboardPage() {
  const scans = useScansStore((s) => s.scans);
  const profile = useProfileStore((s) => s.profile);
  const recentScans = scans.slice(0, 5);

  const safeCount = scans.filter((s) => s.status === "safe").length;
  const cautionCount = scans.filter((s) => s.status === "caution").length;
  const avoidCount = scans.filter((s) => s.status === "avoid").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--color-text)]">
          {profile.name ? `Hi, ${profile.name}!` : "Welcome back!"}
        </h2>
        <p className="text-[var(--color-muted)] text-lg">
          {scans.length === 0
            ? "Upload your first food label to get started."
            : `You've scanned ${scans.length} product${scans.length === 1 ? "" : "s"}.`}
        </p>
      </section>

      {/* Upload CTA */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/app/scan"
          className="card-hover flex flex-col items-center justify-center w-full sm:w-2/3 border-2 border-dashed border-[var(--color-primary)] bg-[var(--color-surface)] rounded-2xl p-8 min-h-[140px] transition-all group"
        >
          <div className="gradient-primary text-white p-4 rounded-2xl mb-4 shadow-md group-hover:shadow-lg transition-shadow">
            <Upload size={32} />
          </div>
          <span className="text-[var(--color-text)] font-bold text-xl">Upload a food label</span>
          <span className="text-[var(--color-muted)] text-sm mt-1">JPG, PNG, or WEBP · Max 10MB</span>
        </Link>

        <Link
          to="/app/offline-check"
          className="card-hover flex flex-col items-center justify-center w-full sm:w-1/3 bg-[var(--color-avoid-bg)] border border-[var(--color-avoid)] rounded-2xl p-6 min-h-[140px] transition-all group"
        >
          <div className="text-[var(--color-avoid)] p-3 bg-white/50 rounded-2xl mb-3 shadow-sm group-hover:shadow transition-shadow">
            <ShieldAlert size={28} />
          </div>
          <span className="text-[var(--color-avoid)] font-bold text-lg text-center leading-tight">Offline<br/>Emergency Check</span>
        </Link>
      </div>

      {/* Quick Stats */}
      {scans.length > 0 && (
        <section className="grid grid-cols-3 gap-3">
          <div className="bg-[var(--color-safe-bg)] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[var(--color-safe)]">{safeCount}</p>
            <p className="text-xs font-bold text-[var(--color-safe)]">Safe</p>
          </div>
          <div className="bg-[var(--color-caution-bg)] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[var(--color-caution)]">{cautionCount}</p>
            <p className="text-xs font-bold text-[var(--color-caution)]">Caution</p>
          </div>
          <div className="bg-[var(--color-avoid-bg)] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[var(--color-avoid)]">{avoidCount}</p>
            <p className="text-xs font-bold text-[var(--color-avoid)]">Avoid</p>
          </div>
        </section>
      )}

      {/* Profile Summary */}
      {profile.allergies.length > 0 && (
        <section className="bg-[var(--color-surface)] p-5 rounded-2xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[var(--color-text)]">Your allergen watch list</h3>
            <Link to="/app/profile" className="text-sm text-[var(--color-primary)] font-bold">Edit</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.allergies.map((a) => (
              <span key={a} className="bg-[var(--color-avoid-bg)] text-[var(--color-avoid)] text-sm font-bold px-3 py-1 rounded-full">
                {a}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Recent Scans */}
      {recentScans.length > 0 && (
        <section className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <div className="flex items-center justify-between p-5 pb-3">
            <h3 className="font-bold text-[var(--color-text)] flex items-center gap-2">
              <Clock size={18} className="text-[var(--color-muted)]" />
              Recent Scans
            </h3>
            <Link to="/app/history" className="text-sm text-[var(--color-primary)] font-bold">See all</Link>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {recentScans.map((scan) => {
              const cfg = statusConfig[scan.status as ScanStatus];
              return (
                <Link
                  key={scan.scanId}
                  to={`/app/scan/${scan.scanId}`}
                  className="flex items-center justify-between p-4 px-5 hover:bg-[var(--color-bg)] transition-colors"
                >
                  <div>
                    <p className="font-bold text-[var(--color-text)]">{scan.productName || "Food label"}</p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {new Date(scan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1.5 ${cfg.color}`}>
                    <cfg.Icon size={18} />
                    <span className="font-bold text-sm">{cfg.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty State */}
      {scans.length === 0 && (
        <section className="bg-[var(--color-surface)] rounded-2xl p-8 text-center border border-[var(--color-border)]">
          <TrendingUp size={40} className="mx-auto text-[var(--color-muted)] mb-3" />
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Your scan history will appear here</h3>
          <p className="text-[var(--color-muted)]">
            Upload a food label to see personalized allergen and nutrition guidance.
          </p>
        </section>
      )}
    </div>
  );
}
