import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShieldAlert, HeartPulse, ShieldCheck, Info, Search, Package, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useProfileStore } from "../features/profile/profile.store";

export function ProductDetailPage() {
  const { productId } = useParams();
  const profile = useProfileStore(s => s.profile);
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${productId}.json`);
        const data = await res.json();
        
        if (data.status === 1 && data.product) {
          // Process data
          const p = data.product;
          
          // Basic rules for mock safety status
          const allergens = p.allergens_tags ? p.allergens_tags.map((t: string) => t.replace("en:", "").replace("-", " ")) : [];
          
          let status = "safe";
          if (allergens.some((a: string) => profile.allergies.some(pa => pa.toLowerCase() === a.toLowerCase()))) {
            status = "avoid";
          } else if (p.nova_group === 4) {
            status = "caution";
          }

          setProduct({
            name: p.product_name || "Unknown Product",
            brand: p.brands || "Unknown Brand",
            image: p.image_front_url,
            status,
            sugar: p.nutriments?.sugars_100g > 15 ? "High" : "Low",
            salt: p.nutriments?.salt_100g > 1.5 ? "High" : "Low",
            fat: p.nutriments?.["saturated-fat_100g"] > 5 ? "High" : p.nutriments?.["saturated-fat_100g"] > 1 ? "Moderate" : "Low",
            nova: p.nova_group || "Unknown",
            allergens: allergens,
            risks: p.nova_group === 4 ? [
              { condition: "General Health", desc: "Ultra-processed foods (NOVA 4) are linked to higher risks of chronic diseases." }
            ] : []
          });
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        setError("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    }
    
    if (productId) loadProduct();
  }, [productId, profile.allergies]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center animate-fade-in">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[var(--color-text)]">Analyzing Product...</h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center animate-fade-in space-y-4">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-2" />
        <h2 className="text-2xl font-bold text-[var(--color-text)]">{error || "Product not found"}</h2>
        <Link to="/app/search" className="text-[var(--color-primary)] font-bold">Go back to Search</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in space-y-6">
      <Link to="/app/search" className="text-[var(--color-primary)] font-bold flex items-center gap-2 mb-4">
        <ArrowLeft size={20} /> Back to Search
      </Link>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm relative overflow-hidden flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
        <div className={`absolute top-0 left-0 w-full h-2 ${
          product.status === 'safe' ? 'bg-green-500' : 
          product.status === 'avoid' ? 'bg-red-500' : 'bg-orange-500'
        }`} />
        
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-32 h-32 object-contain rounded-xl border border-gray-100 bg-white" />
        ) : (
          <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
            <Package size={40} className="text-gray-300" />
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-[var(--color-text)] mb-1">{product.name}</h1>
          <p className="text-lg text-[var(--color-muted)] font-medium mb-4">{product.brand}</p>
          
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${
            product.status === 'safe' ? 'bg-green-50 border-green-200 text-green-700' : 
            product.status === 'avoid' ? 'bg-red-50 border-red-200 text-red-700' : 
            'bg-orange-50 border-orange-200 text-orange-700'
          }`}>
            {product.status === 'safe' ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
            <span className="font-bold text-lg uppercase tracking-wider">{product.status} for you</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
            <Info className="text-[var(--color-primary)]" /> Nutrition Snapshot (per 100g)
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2">
              <span className="text-[var(--color-muted)] font-medium">Sugar</span>
              <span className={`font-bold ${product.sugar === 'High' ? 'text-red-500' : 'text-green-500'}`}>{product.sugar}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2">
              <span className="text-[var(--color-muted)] font-medium">Salt / Sodium</span>
              <span className={`font-bold ${product.salt === 'High' ? 'text-red-500' : 'text-green-500'}`}>{product.salt}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2">
              <span className="text-[var(--color-muted)] font-medium">Saturated Fat</span>
              <span className={`font-bold ${product.fat === 'High' ? 'text-red-500' : product.fat === 'Moderate' ? 'text-orange-500' : 'text-green-500'}`}>{product.fat}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[var(--color-muted)] font-medium">NOVA Processing Score</span>
              <span className="font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-sm">Group {product.nova}</span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
            <ShieldAlert className="text-[var(--color-primary)]" /> Identified Allergens
          </h2>
          {product.allergens.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {product.allergens.map((a: string) => (
                <span key={a} className="bg-red-100 text-red-700 font-bold px-3 py-1.5 rounded-lg text-sm capitalize">{a}</span>
              ))}
            </div>
          ) : (
            <p className="text-[var(--color-muted)]">No major allergens detected by manufacturer.</p>
          )}
        </div>
      </div>

      {product.risks.length > 0 && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-2 flex items-center gap-2">
            <HeartPulse className="text-rose-500" /> Health & Disease Risks
          </h2>
          <div className="space-y-4">
            {product.risks.map((risk: any, idx: number) => (
              <div key={idx} className="flex flex-col gap-1 border-l-4 border-rose-400 pl-4 py-1">
                <span className="font-bold text-[var(--color-text)] text-sm">{risk.condition}</span>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed">{risk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
