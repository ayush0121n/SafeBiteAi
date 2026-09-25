import { useProfileStore } from "../features/profile/profile.store";
import { useState } from "react";
import { User, X } from "lucide-react";

const COMMON_ALLERGIES = ["Peanuts", "Tree Nuts", "Milk", "Eggs", "Wheat", "Soy", "Fish", "Shellfish", "Sesame"];
const CONDITIONS = [
  { key: "diabetes" as const, label: "Diabetes / Blood Sugar" },
  { key: "hypertension" as const, label: "Hypertension / Blood Pressure" },
  { key: "heart_health" as const, label: "Heart Health" },
  { key: "celiac" as const, label: "Celiac / Gluten-Free" },
  { key: "kidney_health" as const, label: "Kidney Health" },
];
const PREFERENCES = [
  { key: "low_sugar" as const, label: "Low Sugar" },
  { key: "low_sodium" as const, label: "Low Sodium" },
  { key: "low_saturated_fat" as const, label: "Low Saturated Fat" },
  { key: "vegan" as const, label: "Vegan" },
  { key: "vegetarian" as const, label: "Vegetarian" },
];

export function ProfilePage() {
  const { profile, setAllergies, setConditions, setPreferences, setAccessibility, save } =
    useProfileStore();
  const [justSaved, setJustSaved] = useState(false);

  const toggle = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item];

  const handleSave = () => {
    save();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-3">
        <div className="bg-[#4E8F68] p-3 rounded-full">
          <User size={28} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#19352a]">Your Profile</h2>
      </div>

      {/* Allergies */}
      <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-[#19352a] text-lg mb-3">Allergies to avoid</h3>
        <div className="flex flex-wrap gap-2">
          {COMMON_ALLERGIES.map((a) => (
            <button
              key={a}
              onClick={() => setAllergies(toggle(profile.allergies, a))}
              className={`px-4 py-2 rounded-lg border-2 font-bold transition-colors ${
                profile.allergies.includes(a)
                  ? "bg-[#D95D59] border-[#D95D59] text-white"
                  : "border-gray-200 text-[#19352a] hover:border-[#D95D59]"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </section>

      {/* Health Conditions */}
      <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-[#19352a] text-lg mb-3">Health goals</h3>
        <div className="space-y-2">
          {CONDITIONS.map((c) => (
            <button
              key={c.key}
              onClick={() => setConditions(toggle(profile.conditions, c.key))}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 font-bold transition-colors ${
                profile.conditions.includes(c.key)
                  ? "bg-[#4E8F68] border-[#4E8F68] text-white"
                  : "border-gray-200 text-[#19352a] hover:border-[#4E8F68]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Dietary Preferences */}
      <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-[#19352a] text-lg mb-3">Dietary preferences</h3>
        <div className="flex flex-wrap gap-2">
          {PREFERENCES.map((p) => (
            <button
              key={p.key}
              onClick={() => setPreferences(toggle(profile.preferences, p.key))}
              className={`px-4 py-2 rounded-lg border-2 font-bold transition-colors ${
                profile.preferences.includes(p.key)
                  ? "bg-[#4E8F68] border-[#4E8F68] text-white"
                  : "border-gray-200 text-[#19352a] hover:border-[#4E8F68]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* Accessibility */}
      <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-[#19352a] text-lg mb-3">Accessibility</h3>
        <div className="space-y-3">
          {[
            { key: "largeText" as const, label: "Large text mode" },
            { key: "highContrast" as const, label: "High contrast mode" },
            { key: "voiceReadout" as const, label: "Voice readout by default" },
          ].map((opt) => (
            <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.accessibility[opt.key]}
                onChange={() =>
                  setAccessibility({
                    ...profile.accessibility,
                    [opt.key]: !profile.accessibility[opt.key],
                  })
                }
                className="w-6 h-6 accent-[#4E8F68]"
              />
              <span className="text-[#19352a] font-bold">{opt.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`w-full py-4 rounded-xl font-bold text-xl transition-colors ${
          justSaved
            ? "bg-[#4E9B69] text-white"
            : "bg-[#4E8F68] text-white hover:bg-[#3d7052]"
        }`}
      >
        {justSaved ? "✓ Saved!" : "Save Profile"}
      </button>
    </div>
  );
}
