import { BookOpen, Activity, Heart, Info, ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const CONDITIONS = [
  {
    id: "hypertension",
    name: "Hypertension (High Blood Pressure)",
    icon: Heart,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    description: "A condition in which the force of the blood against the artery walls is too high.",
    foodsToAvoid: ["High Sodium Foods", "Canned Soups", "Processed Meats", "Pickles"],
    foodsToEat: ["Leafy Greens", "Berries", "Oats", "Garlic", "Pistachios"],
    mechanism: "High sodium pulls water into your blood vessels, increasing the total volume of blood. This causes blood pressure to rise."
  },
  {
    id: "type2-diabetes",
    name: "Type 2 Diabetes",
    icon: Activity,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    description: "A chronic condition that affects the way the body processes blood sugar (glucose).",
    foodsToAvoid: ["Sugary Drinks", "Refined Carbs", "Trans Fats", "Sweetened Yogurt"],
    foodsToEat: ["Fatty Fish", "Leafy Greens", "Avocados", "Chia Seeds", "Beans"],
    mechanism: "Simple carbohydrates and added sugars cause rapid spikes in blood glucose, overwhelming insulin response."
  },
  {
    id: "celiac",
    name: "Celiac Disease",
    icon: Info,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    description: "An immune reaction to eating gluten, a protein found in wheat, barley, and rye.",
    foodsToAvoid: ["Wheat", "Barley", "Rye", "Malt", "Brewer's Yeast"],
    foodsToEat: ["Quinoa", "Brown Rice", "Buckwheat", "Fresh Meats", "Fruits & Veggies"],
    mechanism: "Gluten triggers an immune response that damages the lining of the small intestine, preventing nutrient absorption."
  },
  {
    id: "gerd",
    name: "GERD (Acid Reflux)",
    icon: Activity,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    description: "A digestive disease in which stomach acid or bile irritates the food pipe lining.",
    foodsToAvoid: ["Spicy Foods", "Citrus Fruits", "Tomato Sauce", "Fried Foods", "Peppermint"],
    foodsToEat: ["Oatmeal", "Non-citrus Fruits", "Lean Meats", "Egg Whites", "Healthy Fats"],
    mechanism: "Certain foods relax the lower esophageal sphincter (LES) or increase stomach acid production, allowing acid to escape upwards."
  },
  {
    id: "ibs",
    name: "Irritable Bowel Syndrome (IBS)",
    icon: Info,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    description: "An intestinal disorder causing pain in the belly, gas, diarrhea, and constipation.",
    foodsToAvoid: ["High FODMAP Foods", "Dairy", "Fried Foods", "Beans", "Artificial Sweeteners"],
    foodsToEat: ["Low FODMAP Foods", "Oats", "Lean Meats", "Eggs", "Lactose-free Dairy"],
    mechanism: "Fermentable carbs (FODMAPs) pull water into the intestinal tract and are fermented by bacteria, producing gas and causing bloating."
  }
];

export function LearnPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);

  const filteredConditions = CONDITIONS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-lg text-white">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">Learn & Health Intelligence</h1>
        <p className="text-lg opacity-90 mb-6 max-w-2xl">
          Understand exactly how different foods interact with your body. Browse health conditions, discover triggering ingredients, and find safe alternatives.
        </p>
        
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search conditions (e.g., Diabetes, GERD)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-gray-900 py-3 pl-12 pr-4 rounded-xl font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-[var(--color-text)] px-2">Health Conditions</h2>
          <div className="space-y-3">
            {filteredConditions.map((condition) => (
              <button
                key={condition.id}
                onClick={() => setSelectedCondition(condition.id)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                  selectedCondition === condition.id 
                    ? `border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md transform scale-[1.02]` 
                    : `border-[var(--color-border)] bg-[var(--color-surface)] hover:border-indigo-300 hover:shadow-sm`
                }`}
              >
                <div className={`p-3 rounded-xl ${condition.bg}`}>
                  <condition.icon size={24} className={condition.color} />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-text)]">{condition.name}</h3>
                </div>
              </button>
            ))}
            {filteredConditions.length === 0 && (
              <p className="text-[var(--color-muted)] p-4 text-center border border-dashed rounded-xl border-[var(--color-border)]">
                No conditions found. Try another search.
              </p>
            )}
          </div>
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2">
          {selectedCondition ? (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 shadow-sm animate-slide-up sticky top-6">
              {(() => {
                const condition = CONDITIONS.find(c => c.id === selectedCondition)!;
                return (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-4 rounded-2xl ${condition.bg} ${condition.borderColor} border`}>
                        <condition.icon size={32} className={condition.color} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-extrabold text-[var(--color-text)]">{condition.name}</h2>
                      </div>
                    </div>
                    
                    <p className="text-lg text-[var(--color-muted)] mb-8 leading-relaxed">
                      {condition.description}
                    </p>

                    <div className="bg-[var(--color-bg)] p-6 rounded-2xl border border-[var(--color-border)] mb-8">
                      <h3 className="text-xl font-bold text-[var(--color-text)] mb-3 flex items-center gap-2">
                        <BookOpen size={20} className="text-indigo-500" />
                        Biological Mechanism
                      </h3>
                      <p className="text-[var(--color-muted)] leading-relaxed">
                        {condition.mechanism}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-6">
                        <h3 className="font-bold text-red-700 dark:text-red-400 text-lg mb-4">Foods to Avoid</h3>
                        <ul className="space-y-3">
                          {condition.foodsToAvoid.map((food, i) => (
                            <li key={i} className="flex items-start gap-2 text-red-800 dark:text-red-300">
                              <span className="mt-1 opacity-60">•</span>
                              <span className="font-semibold">{food}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-2xl p-6">
                        <h3 className="font-bold text-green-700 dark:text-green-400 text-lg mb-4">Foods to Eat</h3>
                        <ul className="space-y-3">
                          {condition.foodsToEat.map((food, i) => (
                            <li key={i} className="flex items-start gap-2 text-green-800 dark:text-green-300">
                              <span className="mt-1 opacity-60">•</span>
                              <span className="font-semibold">{food}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="bg-[var(--color-surface)] border-2 border-dashed border-[var(--color-border)] rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
              <BookOpen size={48} className="text-[var(--color-border)] mb-4" />
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Select a Condition</h2>
              <p className="text-[var(--color-muted)] max-w-sm mx-auto">
                Click on any health condition from the list to view its detailed relationship with food and diet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
