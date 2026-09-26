import { useState } from "react";
import { Search, Package, ArrowRight, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface OFFProduct {
  id: string;
  product_name?: string;
  brands?: string;
  image_front_small_url?: string;
}

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<"in" | "world">("in");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<OFFProduct[]>([]);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    setError("");
    setHasSearched(true);
    
    try {
      let url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`;
      if (region === "in") {
        url += "&tagtype_0=countries&tag_contains_0=contains&tag_0=india";
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.products && Array.isArray(data.products)) {
        setResults(data.products.slice(0, 10)); // limit to 10
      } else {
        setResults([]);
      }
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--color-text)] mb-3">Food Intelligence Search</h1>
        <p className="text-[var(--color-muted)] text-lg">
          Search for any product to instantly see its nutrition, allergens, and health risks using live OpenFoodFacts data.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-10 flex flex-col gap-3">
        <div className="flex gap-2 mb-2">
          <button type="button" onClick={() => setRegion("in")} className={`flex-1 py-2 rounded-xl font-bold border-2 transition-colors ${region === "in" ? "bg-[var(--color-bg)] border-[var(--color-primary)] text-[var(--color-text)]" : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]"}`}>🇮🇳 Indian Database</button>
          <button type="button" onClick={() => setRegion("world")} className={`flex-1 py-2 rounded-xl font-bold border-2 transition-colors ${region === "world" ? "bg-[var(--color-bg)] border-[var(--color-primary)] text-[var(--color-text)]" : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]"}`}>🌍 Global Database</button>
        </div>
        <div className="relative">
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
            disabled={isSearching}
            className="absolute inset-y-2 right-2 px-6 bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 text-white font-bold rounded-xl transition-opacity flex items-center"
          >
            {isSearching ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-2 font-bold mb-8">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {!isSearching && hasSearched && results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">Live Results for "{query}"</h2>
          {results.map((product) => (
            <Link
              key={product.id}
              to={`/app/product/${product.id}`}
              className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                  {product.image_front_small_url ? (
                    <img src={product.image_front_small_url} alt={product.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={24} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-text)] text-lg line-clamp-1">{product.product_name || "Unknown Product"}</h3>
                  <p className="text-[var(--color-muted)] text-sm line-clamp-1">{product.brands || "Unknown Brand"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <ArrowRight className="text-[var(--color-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isSearching && hasSearched && results.length === 0 && !error && (
        <div className="text-center py-12 px-4 border-2 border-dashed border-[var(--color-border)] rounded-2xl">
          <Package size={48} className="mx-auto text-[var(--color-muted)] mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">No products found</h3>
          <p className="text-[var(--color-muted)] max-w-md mx-auto">
            We couldn't find any exact matches for "{query}". Try a different keyword or brand.
          </p>
        </div>
      )}

      {!hasSearched && (
        <div className="text-center py-12 px-4 border-2 border-dashed border-[var(--color-border)] rounded-2xl">
          <Package size={48} className="mx-auto text-[var(--color-muted)] mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Start Exploring</h3>
          <p className="text-[var(--color-muted)] max-w-md mx-auto">
            Discover detailed insights about your favorite foods directly from the world's largest open food database.
          </p>
        </div>
      )}
    </div>
  );
}
