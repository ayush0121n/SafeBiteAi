import { ShieldAlert, Info, AlertTriangle } from "lucide-react";
import { useProfileStore } from "../features/profile/profile.store";

const allergenAliases: Record<string, string[]> = {
  "Peanuts": ["Arachis oil", "Groundnuts", "Mandelonas", "Nu-Nuts", "Goober peas", "Monkey nuts"],
  "Tree Nuts": ["Almond", "Brazil nut", "Cashew", "Chestnut", "Filbert", "Hazelnut", "Macadamia", "Pecan", "Pine nut", "Pistachio", "Walnut", "Marzipan", "Praline"],
  "Milk": ["Butter", "Casein", "Cheese", "Cream", "Curds", "Ghee", "Lactose", "Paneer", "Whey", "Yogurt", "Lactalbumin"],
  "Eggs": ["Albumin", "Globulin", "Lecithin", "Lysozyme", "Mayonnaise", "Meringue", "Ovalbumin", "Surimi"],
  "Soy": ["Edamame", "Miso", "Natto", "Shoyu", "Soy sauce", "Tamari", "Tempeh", "Tofu", "Soya"],
  "Wheat": ["Bran", "Bread crumbs", "Bulgur", "Couscous", "Durum", "Einkorn", "Emmer", "Farina", "Kamut", "Seitan", "Semolina", "Spelt"],
  "Fish": ["Anchovies", "Bass", "Catfish", "Cod", "Flounder", "Grouper", "Haddock", "Hake", "Halibut", "Herring", "Mahi mahi", "Pike", "Pollock", "Salmon", "Snapper", "Sole", "Swordfish", "Tilapia", "Trout", "Tuna"],
  "Shellfish": ["Barnacle", "Crab", "Crawfish", "Krill", "Lobster", "Prawns", "Shrimp", "Clams", "Mussels", "Oysters", "Scallops", "Squid", "Octopus"],
  "Sesame": ["Benne", "Gingelly", "Halvah", "Sesamol", "Tahini", "Til"],
  "Mollusks": ["Abalone", "Clam", "Cockle", "Cuttlefish", "Mussel", "Octopus", "Oyster", "Scallop", "Snail", "Squid"],
  "Lupin": ["Lupine", "Lupin flour", "Lupin seed", "Lupin bean"],
  "Mustard": ["Mustard powder", "Mustard seed", "Mustard leaves"]
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
            <li>Check the <strong>"Contains:"</strong> statement usually found below the ingredients list.</li>
            <li>Look out for <strong>"May contain"</strong> or <strong>"Produced in a facility that handles"</strong> warnings.</li>
            <li>Ingredients are listed by weight, from most to least.</li>
            <li>When in doubt, contact the manufacturer or avoid the product.</li>
         </ul>
      </div>
    </div>
  );
}
