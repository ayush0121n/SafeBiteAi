import { Link } from "react-router-dom";
import { 
  AlertTriangle, 
  Activity, 
  Pill, 
  Utensils, 
  CheckCircle, 
  ShieldAlert, 
  Baby, 
  Barcode, 
  BrainCircuit, 
  List
} from "lucide-react";

export function FeaturesHubPage() {
  const features = [
    {
      id: "allergen-cross-contamination",
      title: "Allergen Cross-Contamination",
      description: "Analyzes 'may contain' statements for probability and visual cues.",
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-100",
      status: "Beta"
    },
    {
      id: "hidden-sugar-detector",
      title: "Hidden Sugar / Ultra-Processed Detector",
      description: "Detects hidden sugars and uses NOVA classification.",
      icon: Activity,
      color: "text-orange-500",
      bg: "bg-orange-100",
      status: "Beta"
    },
    {
      id: "medication-interaction",
      title: "Medication-Food Interactions",
      description: "Alerts for interactions like Warfarin + leafy greens.",
      icon: Pill,
      color: "text-purple-500",
      bg: "bg-purple-100",
      status: "Beta"
    },
    {
      id: "meal-estimator",
      title: "Plate to Macro + Allergen Estimate",
      description: "No barcode needed. Estimates macros from meal photos.",
      icon: Utensils,
      color: "text-green-500",
      bg: "bg-green-100",
      status: "Active"
    },
    {
      id: "label-quality",
      title: "Real-time Label Quality",
      description: "Scores readability of photos before OCR upload.",
      icon: CheckCircle,
      color: "text-blue-500",
      bg: "bg-blue-100",
      status: "Active"
    },
    {
      id: "safer-alternatives",
      title: "Personalized Safer Alternatives",
      description: "Finds safe product replacements when items are flagged 'Avoid'.",
      icon: List,
      color: "text-teal-500",
      bg: "bg-teal-100",
      status: "Coming Soon"
    },
    {
      id: "recall-watch",
      title: "Recall & Contaminant Watch",
      description: "Matches your scan history with openFDA / RASFF feeds.",
      icon: ShieldAlert,
      color: "text-rose-500",
      bg: "bg-rose-100",
      status: "Active"
    },
    {
      id: "kids-elderly-mode",
      title: "Kids / Elderly Mode",
      description: "Simplified UI with Text-to-Speech (TTS) verdicts.",
      icon: Baby,
      color: "text-pink-500",
      bg: "bg-pink-100",
      status: "Coming Soon"
    },
    {
      id: "hybrid-scan",
      title: "Barcode + Label Hybrid",
      description: "Scans barcodes optionally and falls back to OCR.",
      icon: Barcode,
      color: "text-slate-500",
      bg: "bg-slate-100",
      status: "Coming Soon"
    },
    {
      id: "continuous-learning",
      title: "Continuous Learning",
      description: "Self-correcting OCR models based on user feedback.",
      icon: BrainCircuit,
      color: "text-indigo-500",
      bg: "bg-indigo-100",
      status: "Future"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <section className="text-center py-8">
        <h2 className="text-3xl font-extrabold text-[var(--color-text)] mb-3">SafeBite Advanced Features</h2>
        <p className="text-[var(--color-muted)] text-lg max-w-2xl mx-auto">
          Explore our suite of next-generation AI features designed to keep you safe and healthy.
        </p>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div key={feature.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`${feature.bg} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                <feature.icon className={feature.color} size={28} />
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${feature.status === 'Active' ? 'bg-green-100 text-green-700' : feature.status === 'Beta' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}`}>
                {feature.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{feature.title}</h3>
            <p className="text-[var(--color-muted)] text-sm mb-4">{feature.description}</p>
            <Link to={`/app/features/${feature.id}`} className="text-[var(--color-primary)] font-bold text-sm flex items-center gap-1 hover:underline">
              Explore Feature &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
