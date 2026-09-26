import { ShieldAlert, Info, AlertTriangle } from "lucide-react";
import { useProfileStore } from "../features/profile/profile.store";

const allergenAliases: Record<string, string[]> = {
  "Peanuts": ["Arachis oil", "Groundnuts", "Mungphali", "Shengdana", "Goober peas", "Monkey nuts"],
  "Tree Nuts": ["Almond (Badam)", "Cashew (Kaju)", "Walnut (Akhrot)", "Pistachio (Pista)", "Brazil nut", "Macadamia", "Pecan", "Pine nut"],
  "Milk": ["Butter (Makhan)", "Casein", "Cheese", "Cream (Malai)", "Curds (Dahi)", "Ghee", "Paneer", "Whey", "Khoya", "Mawa"],
  "Eggs": ["Anda", "Albumin", "Globulin", "Lecithin", "Lysozyme", "Mayonnaise", "Meringue", "Ovalbumin"],
  "Soy": ["Edamame", "Soya chunk (Nutrela)", "Soy sauce", "Tamari", "Tempeh", "Tofu"],
  "Wheat": ["Atta (Whole Wheat)", "Maida (Refined Flour)", "Suji/Rava (Semolina)", "Daliya (Bulgur)", "Bran", "Seitan", "Spelt"],
  "Fish": ["Machli", "Anchovies", "Cod", "Herring", "Salmon", "Tuna", "Rohu", "Katla", "Pomfret", "Surmai"],
  "Shellfish": ["Jhinga (Shrimp/Prawn)", "Crab (Kekda)", "Lobster", "Clams", "Mussels", "Oysters", "Squid"],
  "Sesame": ["Til", "Gingelly", "Tahini", "Benne"],
  "Mollusks": ["Abalone", "Clam", "Cuttlefish", "Mussel", "Octopus", "Oyster", "Scallop", "Squid"],
  "Lupin": ["Lupine", "Lupin flour", "Lupin seed"],
  "Mustard": ["Sarson (Mustard seed/oil)", "Rai", "Mustard powder"]
};

export function OfflineCheckPage() {
  const profile = useProfileStore((s) => s.profile);
  const userAllergies = profile.allergies || [];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <section>
        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-1 flex items-center gap-2">
          <ShieldAlert className="text-[var(--color-avoid)]" />
          Offline Emergency Check
        </h2>
        <p className="text-[var(--color-muted)] text-lg">
          No internet? Use this guide to manually check food labels for your specific allergens.
        </p>
      </section>

      {userAllergies.length === 0 ? (
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] text-center">
          <p className="text-[var(--color-muted)]">
            You don't have any allergies saved in your profile.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-[var(--color-avoid-bg)] border border-[var(--color-avoid)] text-[var(--color-avoid)] p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="mt-0.5 flex-shrink-0" />
            <p className="text-sm font-bold">
              Always read the entire label. If a product contains any of these words, it may not be safe for you.
            </p>
          </div>

          {userAllergies.map(allergy => (
            <div key={allergy} className="bg-[var(--color-surface)] p-5 rounded-2xl border border-[var(--color-border)]">
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-3 border-b border-[var(--color-border)] pb-2">
                {allergy}
              </h3>
              <div>
                <p className="text-sm font-bold text-[var(--color-muted)] mb-2 uppercase tracking-wider">Common Hidden Names:</p>
                <div className="flex flex-wrap gap-2">
                  {(allergenAliases[allergy] || ["Check local alias lists"]).map(alias => (
                    <span key={alias} className="bg-[var(--color-bg)] px-3 py-1.5 rounded-lg text-sm font-medium border border-[var(--color-border)]">
                      {alias}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[var(--color-surface)] p-5 rounded-2xl border border-[var(--color-border)] mt-6">
         <h3 className="text-lg font-bold text-[var(--color-text)] mb-2 flex items-center gap-2">
            <Info className="text-[var(--color-primary)]" size={20} />
            Manual Checking Tips
         </h3>
         <ul className="text-[var(--color-muted)] space-y-2 list-disc list-inside text-sm">
            <li>Look for the <strong>Green Dot 🟢</strong> (Vegetarian) or <strong>Brown Triangle 🔺</strong> (Non-Vegetarian) on Indian packaging. Eggs and meat fall under Non-Veg.</li>
            <li>Check for the <strong>FSSAI Logo</strong> and License Number to ensure it's a regulated product.</li>
            <li>Read the <strong>"Contains:"</strong> statement or Allergen Declaration usually found directly below the ingredients list in bold.</li>
            <li>Look out for <strong>"May contain traces of"</strong> or <strong>"Manufactured in a facility that also processes"</strong> warnings.</li>
            <li>Ingredients in India are listed by weight, from most to least. Hidden allergens are often at the end.</li>
         </ul>
      </div>
    </div>
  );
}
