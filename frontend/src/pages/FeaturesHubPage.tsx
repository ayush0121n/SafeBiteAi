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
  List,
  HeartPulse,
  Microscope
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
      status: "Active"
    },
    {
      id: "hidden-sugar-detector",
      title: "Hidden Sugar / Ultra-Processed",
      description: "Detects hidden sugars and uses NOVA classification.",
      icon: Activity,
      color: "text-orange-500",
      bg: "bg-orange-100",
      status: "Active"
    },
    {
      id: "medication-interaction",
      title: "Medication-Food Interactions",
      description: "Alerts for interactions like Warfarin + leafy greens.",
      icon: Pill,
      color: "text-purple-500",
      bg: "bg-purple-100",
      status: "Active"
    },
    {
      id: "meal-estimator",
      title: "Plate to Macro + Allergen",
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
      title: "Personalized Alternatives",
      description: "Finds safe product replacements when items are flagged 'Avoid'.",
      icon: List,
      color: "text-teal-500",
      bg: "bg-teal-100",
      status: "Active"
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
      status: "Active"
    },
    {
      id: "pregnancy-safe-mode",
      title: "Pregnancy Safe Mode",
      description: "Filters out high-risk foods (unpasteurized, high mercury) for expecting mothers.",
      icon: HeartPulse,
      color: "text-fuchsia-500",
      bg: "bg-fuchsia-100",
      status: "Beta"
    },
    {
      id: "gut-health-analyzer",
      title: "Gut Health & FODMAP",
      description: "Identifies triggers for IBS and provides low-FODMAP alternatives.",
      icon: Microscope,
      color: "text-emerald-500",
      bg: "bg-emerald-100",
      status: "Beta"
    },
    {
      id: "hybrid-scan",
      title: "Barcode + Label Hybrid",
      description: "Scans barcodes optionally and falls back to OCR.",
      icon: Barcode,
      color: "text-slate-500",
      bg: "bg-slate-100",
      status: "Active"
    },
    {
      id: "continuous-learning",
      title: "Continuous Learning",
      description: "Self-correcting OCR models based on user feedback.",
      icon: BrainCircuit,
      color: "text-indigo-500",
      bg: "bg-indigo-100",
      status: "Active"
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto py-8 px-4">
      <section className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">SafeBite Advanced Features</h2>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Explore our suite of next-generation AI features designed to keep you safe, healthy, and informed.
          </p>
        </div>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {features.map((feature) => (
          <div key={feature.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-2xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer relative overflow-hidden">
            {/* Subtle background glow effect on hover */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${feature.bg} opacity-0 group-hover:opacity-40 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity duration-500`}></div>
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className={`${feature.bg} p-3.5 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <feature.icon className={feature.color} size={28} strokeWidth={2.5} />
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${feature.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : feature.status === 'Beta' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                {feature.status}
              </span>
            </div>
            
            <div className="flex-1 relative z-10">
              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{feature.title}</h3>
              <p className="text-slate-500 text-sm mb-4 leading-relaxed">{feature.description}</p>
            </div>
            
            <Link to={`/app/features/${feature.id}`} className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-sm group/link mt-auto relative z-10 w-fit">
              <span className="relative overflow-hidden">
                <span className="inline-block transition-transform duration-300 group-hover/link:-translate-y-full">Explore Feature</span>
                <span className="absolute top-0 left-0 inline-block transition-transform duration-300 translate-y-full group-hover/link:translate-y-0 text-blue-800">Explore Feature</span>
              </span>
              <span className="transition-transform duration-300 group-hover/link:translate-x-1">&rarr;</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
