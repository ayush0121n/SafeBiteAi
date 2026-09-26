import { useState } from "react";
import { Search, Package, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Mock search results for Phase 1
  const mockResults = [
    { id: "prod_1", name: "Organic Almond Milk", brand: "Silk", status: "safe", icon: "🥛" },
    { id: "prod_2", name: "Spicy Nacho Chips", brand: "Doritos", status: "avoid", icon: "🥨" },
    { id: "prod_3", name: "Gluten-Free Oats", brand: "Quaker", status: "caution", icon: "🥣" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 800); // Simulate network delay
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--color-text)] mb-3">Food Intelligence Search</h1>
        <p className="text-[var(--color-muted)] text-lg">
          Search for any product to instantly see its nutrition, allergens, and health risks.
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-10">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-[var(--color-muted)]" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] text-lg shadow-sm focus:border-[var(--color-primary)] focus:ring-0 transition-colors"
          placeholder="Search by food name, brand, or barcode..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-2 right-2 px-6 bg-[var(--color-primary)] hover:opacity-90 text-white font-bold rounded-xl transition-opacity flex items-center"
        >
          {isSearching ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Search"}
        </button>
      </form>

      {!isSearching && query.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">Results for "{query}"</h2>
          {mockResults.map((product) => (
            <Link
              key={product.id}
              to={`/app/product/${product.id}`}
              className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--color-bg)] rounded-xl flex items-center justify-center text-2xl">
                  {product.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-text)] text-lg">{product.name}</h3>
                  <p className="text-[var(--color-muted)] text-sm">{product.brand}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                  product.status === 'safe' ? 'bg-green-100 text-green-700' :
                  product.status === 'avoid' ? 'bg-red-100 text-red-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {product.status}
                </span>
                <ArrowRight className="text-[var(--color-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {query.length === 0 && (
        <div className="text-center py-12 px-4 border-2 border-dashed border-[var(--color-border)] rounded-2xl">
          <Package size={48} className="mx-auto text-[var(--color-muted)] mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Start Exploring</h3>
          <p className="text-[var(--color-muted)] max-w-md mx-auto">
            Discover detailed insights about your favorite foods, including NOVA processing scores, personalized safety verdicts, and safer alternatives.
          </p>
        </div>
      )}
    </div>
  );
}
