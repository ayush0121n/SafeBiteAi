import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShieldAlert, HeartPulse, ShieldCheck, Info, Search } from "lucide-react";

export function ProductDetailPage() {
  const { productId } = useParams();

  // Mock data for Phase 1
  const product = {
    name: "Spicy Nacho Chips",
    brand: "Doritos",
    status: "avoid",
    calories: 150,
    sugar: "High",
    salt: "High",
    fat: "Moderate",
    nova: 4,
    allergens: ["Milk", "Soy"],
    risks: [
      { condition: "Hypertension", desc: "This product is high in salt, which can raise blood pressure." },
      { condition: "Heart Disease", desc: "Contains trans fats linked to higher heart risk." },
    ],
    alternatives: [
      { name: "Baked Corn Tortillas", brand: "Mission", status: "safe" },
      { name: "Organic Veggie Straws", brand: "Sensible Portions", status: "safe" },
    ]
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in space-y-6">
      <Link to="/app/search" className="text-[var(--color-primary)] font-bold flex items-center gap-2 mb-4">
        <ArrowLeft size={20} /> Back to Search
      </Link>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-2 ${
          product.status === 'safe' ? 'bg-green-500' : 
          product.status === 'avoid' ? 'bg-red-500' : 'bg-orange-500'
        }`} />
        <h1 className="text-3xl font-extrabold text-[var(--color-text)] mb-1">{product.name}</h1>
        <p className="text-lg text-[var(--color-muted)] font-medium mb-6">{product.brand}</p>
        
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${
          product.status === 'safe' ? 'bg-green-50 border-green-200 text-green-700' : 
          product.status === 'avoid' ? 'bg-red-50 border-red-200 text-red-700' : 
          'bg-orange-50 border-orange-200 text-orange-700'
        }`}>
          {product.status === 'safe' ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
          <span className="font-bold text-lg uppercase tracking-wider">{product.status} for you</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
            <Info className="text-[var(--color-primary)]" /> Nutrition Snapshot
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2">
              <span className="text-[var(--color-muted)] font-medium">Sugar</span>
              <span className={`font-bold ${product.sugar === 'High' ? 'text-red-500' : 'text-green-500'}`}>{product.sugar}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2">
              <span className="text-[var(--color-muted)] font-medium">Salt / Sodium</span>
              <span className={`font-bold ${product.salt === 'High' ? 'text-red-500' : 'text-green-500'}`}>{product.salt}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2">
              <span className="text-[var(--color-muted)] font-medium">Saturated Fat</span>
              <span className={`font-bold ${product.fat === 'High' ? 'text-red-500' : product.fat === 'Moderate' ? 'text-orange-500' : 'text-green-500'}`}>{product.fat}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[var(--color-muted)] font-medium">NOVA Processing Score</span>
              <span className="font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-sm">Group {product.nova} (Ultra-Processed)</span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
            <ShieldAlert className="text-[var(--color-primary)]" /> Identified Allergens
          </h2>
          {product.allergens.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {product.allergens.map(a => (
                <span key={a} className="bg-red-100 text-red-700 font-bold px-3 py-1.5 rounded-lg text-sm">{a}</span>
              ))}
            </div>
          ) : (
            <p className="text-[var(--color-muted)]">No major allergens detected.</p>
          )}
        </div>
      </div>

      {product.risks.length > 0 && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-2 flex items-center gap-2">
            <HeartPulse className="text-rose-500" /> Health & Disease Risks
          </h2>
          <p className="text-xs text-[var(--color-muted)] mb-4 bg-slate-50 p-2 rounded-md border border-slate-200">
            <strong>Educational guidance only.</strong> Not medical advice. SafeBite connects ingredients to known health concerns for transparency.
          </p>
          <div className="space-y-4">
            {product.risks.map((risk, idx) => (
              <div key={idx} className="flex flex-col gap-1 border-l-4 border-rose-400 pl-4 py-1">
                <span className="font-bold text-[var(--color-text)] text-sm">{risk.condition}</span>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed">{risk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {product.alternatives.length > 0 && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
            <Search className="text-teal-500" /> Safer Alternatives for You
          </h2>
          <div className="grid gap-3">
            {product.alternatives.map((alt, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl">
                <div>
                  <p className="font-bold text-sm text-[var(--color-text)]">{alt.name}</p>
                  <p className="text-xs text-[var(--color-muted)]">{alt.brand}</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">SAFE</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
