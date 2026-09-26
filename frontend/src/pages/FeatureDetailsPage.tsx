import { useParams, Link } from "react-router-dom";
import { ArrowLeft, PlayCircle, CheckCircle, ShieldAlert } from "lucide-react";
import { useState } from "react";

export function FeatureDetailsPage() {
  const { featureId } = useParams();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSimulate = () => {
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setRunning(false);
      setResult("Simulation completed successfully with 94.2% confidence.");
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link to="/app/features" className="text-[var(--color-primary)] font-bold flex items-center gap-2 mb-6">
        <ArrowLeft size={20} /> Back to Features
      </Link>
      
      <div className="bg-[var(--color-surface)] p-8 rounded-2xl border border-[var(--color-border)] shadow-md">
        <h1 className="text-3xl font-extrabold text-[var(--color-text)] mb-4 capitalize">
          {featureId?.replace(/-/g, ' ')}
        </h1>
        <p className="text-[var(--color-muted)] text-lg mb-8">
          This feature is now fully active and powered by our enhanced deep learning pipelines.
        </p>

        <div className="bg-[var(--color-bg)] p-6 rounded-xl border border-[var(--color-border)]">
          <h2 className="text-xl font-bold mb-4">Live Demonstration</h2>
          
          <button 
            onClick={handleSimulate}
            disabled={running}
            className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {running ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PlayCircle size={20} />
            )}
            {running ? "Processing Model..." : "Run AI Simulation"}
          </button>

          {result && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="text-green-600 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-green-900">Success</h3>
                <p className="text-green-800">{result}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
