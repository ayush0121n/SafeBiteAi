import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useProfileStore } from "../features/profile/profile.store";
import { ShieldCheck, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

const ALLERGY_OPTIONS = [
  "Peanuts", "Tree Nuts", "Milk", "Eggs", "Wheat",
  "Soy", "Fish", "Shellfish", "Sesame", "Mustard",
  "Celery", "Lupin", "Mollusks", "Sulfites",
];

const CONDITION_OPTIONS: Array<{ key: "diabetes" | "hypertension" | "heart_health" | "celiac" | "kidney_health"; label: string; emoji: string }> = [
  { key: "diabetes", label: "Diabetes / Blood Sugar", emoji: "🩸" },
  { key: "hypertension", label: "High Blood Pressure", emoji: "💓" },
  { key: "heart_health", label: "Heart Health", emoji: "❤️" },
  { key: "celiac", label: "Celiac / Gluten-Free", emoji: "🌾" },
  { key: "kidney_health", label: "Kidney Health", emoji: "🫘" },
];

const PREFERENCE_OPTIONS: Array<{ key: "low_sugar" | "low_sodium" | "low_saturated_fat" | "vegan" | "vegetarian"; label: string }> = [
  { key: "low_sugar", label: "Low Sugar" },
  { key: "low_sodium", label: "Low Sodium" },
  { key: "low_saturated_fat", label: "Low Saturated Fat" },
  { key: "vegan", label: "Vegan" },
  { key: "vegetarian", label: "Vegetarian" },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { profile, setAllergies, setConditions, setPreferences, setAccessibility, save } = useProfileStore();
  const [step, setStep] = useState(0);

  const toggle = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item];

  const handleFinish = () => {
    save();
    navigate("/login");
  };

  const steps = [
    // Step 1: Allergies
    <div key="allergies" className="animate-slide-up transform-style-3d">
      <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">What should we watch for?</h2>
      <p className="text-[var(--color-muted)] mb-6 text-lg">Select any ingredients you need to avoid.</p>
      <div className="flex flex-wrap gap-3">
        {ALLERGY_OPTIONS.map((a) => (
          <button
            key={a}
            onClick={() => setAllergies(toggle(profile.allergies, a))}
            className={`px-5 py-3 rounded-xl border-2 font-bold transition-all ${
              profile.allergies.includes(a)
                ? "bg-[var(--color-avoid)] border-[var(--color-avoid)] text-white scale-[1.02] shadow-md"
                : "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-avoid)] bg-[var(--color-surface)]"
            }`}
          >
            {a}
          </button>
        ))}
      </div>
      <p className="text-sm text-[var(--color-muted)] mt-4">You can always change these later in your profile.</p>
    </div>,

    // Step 2: Health conditions
    <div key="conditions" className="animate-slide-up transform-style-3d">
      <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">Any health goals?</h2>
      <p className="text-[var(--color-muted)] mb-6 text-lg">We'll flag ingredients that may matter for these.</p>
      <div className="space-y-3">
        {CONDITION_OPTIONS.map((c) => (
          <button
            key={c.key}
            onClick={() => setConditions(toggle(profile.conditions, c.key))}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 font-bold transition-all flex items-center gap-3 ${
              profile.conditions.includes(c.key)
                ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-md"
                : "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] bg-[var(--color-surface)]"
            }`}
          >
            <span className="text-2xl">{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>
    </div>,

    // Step 3: Dietary preferences
    <div key="preferences" className="animate-slide-up transform-style-3d">
      <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">Dietary preferences?</h2>
      <p className="text-[var(--color-muted)] mb-6 text-lg">Optional — helps us give better guidance.</p>
      <div className="flex flex-wrap gap-3">
        {PREFERENCE_OPTIONS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPreferences(toggle(profile.preferences, p.key))}
            className={`px-5 py-3 rounded-xl border-2 font-bold transition-all ${
              profile.preferences.includes(p.key)
                ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-md"
                : "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] bg-[var(--color-surface)]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <h3 className="font-bold text-[var(--color-text)] text-lg">Accessibility</h3>
        {[
          { key: "largeText" as const, label: "Large text mode" },
          { key: "highContrast" as const, label: "High contrast mode" },
          { key: "voiceReadout" as const, label: "Read results aloud" },
        ].map((opt) => (
          <label key={opt.key} className="flex items-center gap-3 cursor-pointer bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)]">
            <input
              type="checkbox"
              checked={profile.accessibility[opt.key]}
              onChange={() =>
                setAccessibility({ ...profile.accessibility, [opt.key]: !profile.accessibility[opt.key] })
              }
              className="w-6 h-6 accent-[var(--color-primary)]"
            />
            <span className="text-[var(--color-text)] font-bold">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6 flex flex-col items-center">
      {/* Progress */}
      <div className="max-w-md w-full mt-6 mb-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <ShieldCheck size={28} className="text-[var(--color-primary)]" />
          <span className="text-xl font-bold text-[var(--color-text)]">SafeBite</span>
        </div>
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-[var(--color-muted)] mt-2">
          Step {step + 1} of {steps.length}
        </p>
      </div>

      {/* Content */}
      <div className="max-w-md w-full bg-[var(--color-surface)] p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[var(--color-border)] perspective-1000">
        {steps[step]}
      </div>

      {/* Navigation */}
      <div className="max-w-md w-full flex gap-3 mt-6">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold bg-[var(--color-surface)] border-2 border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
          >
            <ChevronLeft size={20} />
            Back
          </button>
        )}

        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex-1 flex items-center justify-center gap-2 gradient-primary text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Continue
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex-1 flex items-center justify-center gap-2 gradient-primary text-white font-bold py-4 rounded-xl shadow-[0_4px_20px_rgba(78,143,104,0.3)] hover:shadow-[0_8px_30px_rgba(78,143,104,0.5)] transition-all transform hover:scale-[1.02]"
          >
            <Sparkles size={20} className="animate-pulse-gentle" />
            Finish & Log In
          </button>
        )}
      </div>

      <button
        onClick={handleFinish}
        className="mt-4 text-[var(--color-muted)] underline text-sm hover:text-[var(--color-text)]"
      >
        Skip for now
      </button>
    </div>
  );
}
