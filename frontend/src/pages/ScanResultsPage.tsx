import {
  ShieldCheck, ShieldAlert, ShieldX, HelpCircle,
  AlertTriangle, Volume2, Save, ChevronDown, ChevronUp,
  ArrowLeft, Share2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useScansStore } from "../features/scans/scans.store";
import { API_URL } from "../api/client";
import type { ScanResult, ScanStatus, ConcernLevel } from "../api/types";

const statusConfig: Record<ScanStatus, { label: string; color: string; bg: string; Icon: typeof ShieldCheck; description: string }> = {
  safe: { label: "Looks Suitable", color: "text-[var(--color-safe)]", bg: "bg-[var(--color-safe-bg)]", Icon: ShieldCheck, description: "No configured concerns found in the readable label." },
  caution: { label: "Review Before Eating", color: "text-[var(--color-caution)]", bg: "bg-[var(--color-caution-bg)]", Icon: ShieldAlert, description: "Some ingredients or nutrition values may need your attention." },
  avoid: { label: "Contains Your Allergen", color: "text-[var(--color-avoid)]", bg: "bg-[var(--color-avoid-bg)]", Icon: ShieldX, description: "This product matched something in your avoid list." },
  uncertain: { label: "Could Not Read Enough", color: "text-[var(--color-uncertain)]", bg: "bg-[var(--color-uncertain-bg)]", Icon: HelpCircle, description: "The label was hard to read. Please check the original package." },
};

const concernColors: Record<ConcernLevel, string> = {
  lower: "bg-[var(--color-safe)]", moderate: "bg-[var(--color-caution)]",
  higher: "bg-[var(--color-avoid)]", unknown: "bg-[var(--color-uncertain)]",
};
const concernLabels: Record<ConcernLevel, string> = {
  lower: "Lower", moderate: "Moderate", higher: "Higher", unknown: "Unknown",
};

export function ScanResultsPage() {
  const { scanId } = useParams();
  const location = useLocation();
  const scans = useScansStore((s) => s.scans);
  const addScan = useScansStore((s) => s.addScan);

  const [result, setResult] = useState<ScanResult | null>(
    location.state?.result || scans.find((s) => s.scanId === scanId) || null
  );
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!result && scanId) {
      import("../api/client").then(({ getScan }) => {
        getScan(scanId)
          .then((data) => setResult(data as ScanResult))
          .catch((err) => setError(err.message))
          .finally(() => setLoading(false));
      });
    }
  }, [scanId, result]);

  const [showIngredients, setShowIngredients] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--color-muted)] font-bold">Loading results...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="text-center p-8 mt-12 bg-[var(--color-avoid-bg)] rounded-2xl">
        <ShieldX size={48} className="mx-auto text-[var(--color-avoid)] mb-4" />
        <h2 className="text-2xl font-bold text-[var(--color-avoid)] mb-2">Result not found</h2>
        <p className="text-[var(--color-text)] mb-6">{error || "This scan may have expired or does not exist."}</p>
        <Link to="/app" className="bg-white px-6 py-3 rounded-xl font-bold shadow-sm inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  const cfg = statusConfig[result.status];
  const saved = scans.some((s) => s.scanId === result.scanId);

  const handleSave = () => {
    if (!saved) { addScan(result); }
  };

  const handleVoiceRead = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const parts = [
        `Overall result: ${cfg.label}.`,
        result.allergens.length > 0
          ? `Allergen alerts: ${result.allergens.map((a) => `${a.name}, matched from ${a.matchedText}`).join(". ")}.`
          : "No allergen alerts found.",
        ...result.concerns.map((c) => `${c.title}: ${c.plainLanguageReason}`),
        result.disclaimers[0],
      ];
      const utterance = new SpeechSynthesisUtterance(parts.join(" "));
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleShare = async () => {
    const text = `SafeBite AI Result: ${cfg.label}\n${result.productName || "Food Label"}\n${result.allergens.length > 0 ? `Allergens: ${result.allergens.map(a => a.name).join(", ")}` : "No allergens detected"}\n\nDisclaimer: This is educational guidance only.`;
    if (navigator.share) {
      await navigator.share({ title: "SafeBite AI Result", text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return (
    <div className="space-y-5 pb-8 animate-fade-in">
      {/* Back link */}
      <Link to="/app" className="inline-flex items-center gap-1 text-[var(--color-muted)] hover:text-[var(--color-text)] font-bold text-sm">
        <ArrowLeft size={16} /> Back to dashboard
      </Link>

      {/* Overall Status */}
      <section className={`${cfg.bg} rounded-2xl p-8 text-center animate-slide-up`}>
        <cfg.Icon size={60} className={`mx-auto mb-3 ${cfg.color}`} />
        <h2 className={`text-3xl font-bold ${cfg.color}`}>{cfg.label}</h2>
        <p className="text-[var(--color-text)] mt-2 text-lg">{cfg.description}</p>
        {result.productName && (
          <p className="font-bold text-[var(--color-text)] mt-3 text-xl">{result.productName}</p>
        )}
      </section>

      {/* Label Confidence Map */}
      {result.imageUrl && result.detectedRegions && result.detectedRegions.length > 0 && (
        <section className="bg-[var(--color-surface)] rounded-2xl p-5 border border-[var(--color-border)] animate-slide-up">
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">What SafeBite Read</h3>
          <p className="text-[var(--color-muted)] text-sm mb-4">
            We read {Math.round(result.confidence.ocr * 100)}% of this label clearly.
          </p>
          <div className="relative w-full overflow-hidden rounded-xl bg-[var(--color-bg)]" style={{ aspectRatio: '4/3' }}>
            <img 
              src={result.imageUrl.startsWith("data:") ? result.imageUrl : `${API_URL}${result.imageUrl}`} 
              alt="Label" 
              className="absolute inset-0 w-full h-full object-contain p-2" 
            />
            {result.detectedRegions.map((region, i) => {
              const colors: Record<string, string> = {
                ingredients_panel: "border-green-500 bg-green-500/10 text-green-700 dark:text-green-300",
                nutrition_facts_panel: "border-green-500 bg-green-500/10 text-green-700 dark:text-green-300",
                allergen_statement: "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300",
                unclear: "border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-300"
              };
              const colorClass = colors[region.label] || "border-gray-500 bg-gray-500/10 text-gray-700";
              const labelMap: Record<string, string> = {
                ingredients_panel: "✓ Ingredients",
                nutrition_facts_panel: "✓ Nutrition",
                allergen_statement: "⚠️ Allergens",
                unclear: "⚠ Unclear"
              };
              return (
                <div 
                  key={i}
                  className={`absolute border-2 rounded ${colorClass} flex items-start justify-start overflow-visible pointer-events-none`}
                  style={{
                    left: `${region.bbox.x}%`,
                    top: `${region.bbox.y}%`,
                    width: `${region.bbox.width}%`,
                    height: `${region.bbox.height}%`
                  }}
                >
                  <span className="text-[10px] sm:text-xs font-bold bg-white/90 dark:bg-black/90 px-1.5 py-0.5 rounded-br rounded-tl-sm shadow-sm whitespace-nowrap">
                    {labelMap[region.label] || region.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Allergen Alerts (Evidence Cards) */}
      {result.allergens.length > 0 && (
        <section className="space-y-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-xl font-bold text-[var(--color-text)]">⚠️ Allergen Evidence</h3>
          {result.allergens.map((a, i) => {
            const isCritical = a.severity === "critical";
            const isPossible = a.matchType === "may_contain";
            const confidence = result.confidence.ingredients > 0.8 ? "High" : result.confidence.ingredients > 0.5 ? "Medium" : "Low";
            return (
              <div key={i} className={`p-5 rounded-xl border-2 ${
                isCritical ? "border-[var(--color-avoid)] bg-[var(--color-avoid-bg)]"
                : isPossible ? "border-[var(--color-caution)] bg-[var(--color-caution-bg)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)]"
              }`}>
                <div className="flex items-center justify-between mb-3 border-b pb-3 border-black/10 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={20} className={isCritical ? "text-[var(--color-avoid)]" : "text-[var(--color-caution)]"} />
                    <span className="font-bold text-lg text-[var(--color-text)]">Detected: {a.name}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${
                    isCritical ? "bg-[var(--color-avoid)]" : isPossible ? "bg-[var(--color-caution)]" : "bg-[var(--color-uncertain)]"
                  }`}>
                    {isCritical ? "Critical" : isPossible ? "May Contain" : "Warning"}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-[var(--color-text)]">
                  <p>
                    <span className="font-bold text-[var(--color-muted)]">Found in: </span>
                    <span className="font-bold">"{a.matchedText}"</span>
                  </p>
                  <p>
                    <span className="font-bold text-[var(--color-muted)]">Why it matters: </span>
                    {a.name} is in your allergy avoid list.
                  </p>
                  <p>
                    <span className="font-bold text-[var(--color-muted)]">Confidence: </span>
                    {confidence}
                  </p>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Concerns */}
      {result.concerns.length > 0 && (
        <section className="space-y-3 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <h3 className="text-xl font-bold text-[var(--color-text)]">What this means for you</h3>
          {result.concerns.map((c, i) => (
            <div key={i} className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[var(--color-text)] text-lg">{c.title}</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${concernColors[c.level]}`}>
                  {concernLabels[c.level]}
                </span>
              </div>
              <p className="text-[var(--color-muted)] leading-relaxed">{c.plainLanguageReason}</p>
              {c.factors.length > 0 && (
                <p className="text-sm text-[var(--color-muted)] mt-2">Key ingredients: {c.factors.join(", ")}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Nutrition */}
      {result.nutrition.calories !== undefined && (
        <section className="bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-border)] animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">Nutrition Summary</h3>
          {result.nutrition.servingSize && (
            <p className="text-sm text-[var(--color-muted)] mb-3">Per serving: {result.nutrition.servingSize}</p>
          )}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Calories", value: result.nutrition.calories },
              { label: "Added Sugar", value: `${result.nutrition.addedSugarG ?? "—"}g` },
              { label: "Sodium", value: `${result.nutrition.sodiumMg ?? "—"}mg` },
              { label: "Sat. Fat", value: `${result.nutrition.saturatedFatG ?? "—"}g` },
              { label: "Fiber", value: `${result.nutrition.fiberG ?? "—"}g` },
              { label: "Protein", value: `${result.nutrition.proteinG ?? "—"}g` },
            ].map((item) => (
              <div key={item.label} className="bg-[var(--color-bg)] rounded-lg p-3">
                <p className="text-sm text-[var(--color-muted)]">{item.label}</p>
                <p className="text-lg font-bold text-[var(--color-text)]">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Extracted Ingredients */}
      <section className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
        <button onClick={() => setShowIngredients(!showIngredients)} className="w-full flex items-center justify-between p-5 text-left">
          <h3 className="text-xl font-bold text-[var(--color-text)]">Extracted Ingredients</h3>
          {showIngredients ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {showIngredients && (
          <div className="px-5 pb-5 border-t border-[var(--color-border)] pt-3">
            <p className="text-[var(--color-muted)] text-sm leading-relaxed whitespace-pre-wrap">
              {result.extractedText.ingredientsRaw}
            </p>
            {result.extractedText.allergyStatement && (
              <p className="mt-3 font-bold text-[var(--color-avoid)] text-sm">{result.extractedText.allergyStatement}</p>
            )}
          </div>
        )}
      </section>

      {/* Confidence */}
      <section className="bg-[var(--color-uncertain-bg)] rounded-xl p-4 flex items-start gap-3">
        <HelpCircle size={20} className="text-[var(--color-uncertain)] mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-bold text-[var(--color-text)] text-sm">Read confidence</p>
          <p className="text-[var(--color-muted)] text-sm">
            OCR: {Math.round(result.confidence.ocr * 100)}% · Ingredients: {Math.round(result.confidence.ingredients * 100)}% · Nutrition: {Math.round(result.confidence.nutrition * 100)}%
          </p>
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saved}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-lg transition-all ${
            saved ? "bg-[var(--color-border)] text-[var(--color-muted)]" : "gradient-primary text-white shadow-md hover:shadow-lg"
          }`}>
          <Save size={20} /> {saved ? "Saved ✓" : "Save Result"}
        </button>
        <button onClick={handleVoiceRead}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold bg-[var(--color-surface)] border-2 border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
          aria-label="Read results aloud">
          <Volume2 size={20} /> Read
        </button>
        <button onClick={handleShare}
          className="flex items-center justify-center px-4 py-3 rounded-xl font-bold bg-[var(--color-surface)] border-2 border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
          aria-label="Share result">
          <Share2 size={20} />
        </button>
      </div>

      {/* Disclaimer */}
      <section className="bg-[var(--color-caution-bg)] rounded-xl p-4 border border-[var(--color-caution)]">
        <p className="font-bold text-[var(--color-text)] text-sm mb-1">⚠️ Important</p>
        {result.disclaimers.map((d, i) => (
          <p key={i} className="text-[var(--color-muted)] text-sm leading-relaxed">{d}</p>
        ))}
      </section>
    </div>
  );
}
