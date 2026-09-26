import { useProfileStore } from "../features/profile/profile.store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";

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
  const { 
    profile, 
    setAllergies, 
    setAllergySeverity,
    setMedications,
    setDietGoals,
    setConditions, 
    setPreferences, 
    setAccessibility, 
    save 
  } = useProfileStore();
  const [justSaved, setJustSaved] = useState(false);
  const navigate = useNavigate();

  const [newMed, setNewMed] = useState("");
  const [newGoal, setNewGoal] = useState("");

  const toggle = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item];

  const handleSave = () => {
    save();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("safebite_mock_auth");
    navigate("/login");
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
        <div className="flex flex-wrap gap-2 mb-4">
          {COMMON_ALLERGIES.map((a) => (
            <button
              key={a}
              onClick={() => {
                setAllergies(toggle(profile.allergies, a));
                if (profile.allergies.includes(a)) {
                  const newSeverity = { ...(profile.allergySeverity || {}) };
                  delete newSeverity[a];
                  setAllergySeverity(newSeverity);
                }
              }}
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
        
        {profile.allergies.length > 0 && (
          <div className="border-t border-gray-100 pt-4 mt-4 space-y-3">
            <h4 className="font-bold text-sm text-gray-500 uppercase">Allergy Severity</h4>
            {profile.allergies.map(a => (
              <div key={a} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-red-50 rounded-lg">
                <span className="font-bold text-red-900">{a}</span>
                <select
                  value={profile.allergySeverity?.[a] || "mild"}
                  onChange={(e) => setAllergySeverity({ ...(profile.allergySeverity || {}), [a]: e.target.value as any })}
                  className="bg-white border border-red-200 rounded-lg px-3 py-1.5 text-sm font-bold text-red-800 outline-none"
                >
                  <option value="mild">Mild (Discomfort)</option>
                  <option value="moderate">Moderate (Requires Medication)</option>
                  <option value="severe">Severe (EpiPen Required)</option>
                  <option value="anaphylactic">Anaphylactic (Life Threatening)</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Medications */}
      <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-[#19352a] text-lg mb-1">Medications</h3>
        <p className="text-gray-500 text-sm mb-3">Add medications to check for dangerous food interactions (e.g. Statins, Warfarin).</p>
        
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="e.g. Lipitor (Atorvastatin)"
            value={newMed}
            onChange={(e) => setNewMed(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-semibold text-gray-800 outline-none focus:border-[#4E8F68]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newMed.trim()) {
                setMedications([...(profile.medications || []), newMed.trim()]);
                setNewMed("");
              }
            }}
          />
          <button 
            onClick={() => {
              if (newMed.trim()) {
                setMedications([...(profile.medications || []), newMed.trim()]);
                setNewMed("");
              }
            }}
            className="bg-[#19352a] text-white px-4 py-2 rounded-xl font-bold"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(profile.medications || []).map((med, i) => (
            <div key={i} className="flex items-center gap-2 bg-indigo-50 text-indigo-900 border border-indigo-200 px-3 py-1.5 rounded-lg font-semibold text-sm">
              {med}
              <button 
                onClick={() => setMedications((profile.medications || []).filter((_, idx) => idx !== i))}
                className="text-indigo-400 hover:text-indigo-900"
              >×</button>
            </div>
          ))}
          {(profile.medications || []).length === 0 && (
            <span className="text-sm text-gray-400 italic">No medications added.</span>
          )}
        </div>
      </section>

      {/* Diet Goals */}
      <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-[#19352a] text-lg mb-3">Precise Diet Goals</h3>
        <div className="flex flex-wrap gap-2">
          {["Weight Loss", "Muscle Gain", "Maintenance", "Gut Health", "Energy Focus", "Anti-inflammatory"].map((g) => (
            <button
              key={g}
              onClick={() => setDietGoals(toggle(profile.dietGoals || [], g))}
              className={`px-4 py-2 rounded-lg border-2 font-bold transition-colors ${
                (profile.dietGoals || []).includes(g)
                  ? "bg-[#4E8F68] border-[#4E8F68] text-white"
                  : "border-gray-200 text-[#19352a] hover:border-[#4E8F68]"
              }`}
            >
              {g}
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

      <div className="pt-4 mt-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </div>
  );
}
