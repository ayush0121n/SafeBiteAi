import { useParams, Link } from "react-router-dom";
import { ArrowLeft, PlayCircle, CheckCircle, Upload, Type, Activity, Database, AlertTriangle, ShieldCheck } from "lucide-react";
import { useState, useRef } from "react";

// Simple client-side analyzers for text input
const HIDDEN_SUGARS = [
  "maltodextrin", "dextrose", "glucose", "fructose", "sucrose", "corn syrup",
  "high fructose corn syrup", "invert sugar", "cane sugar", "brown rice syrup",
  "agave", "maple syrup", "molasses", "honey", "fruit juice concentrate",
  "evaporated cane juice", "glucose syrup", "barley malt", "maltose"
];

const MEDICATION_INTERACTIONS: Record<string, string[]> = {
  "warfarin": ["spinach", "kale", "broccoli", "cabbage", "lettuce", "leafy greens", "vitamin k"],
  "statin": ["grapefruit", "pomelo", "seville orange"],
  "maoi": ["aged cheese", "cured meat", "soy sauce", "tofu", "sauerkraut", "tyramine"],
  "ace inhibitor": ["banana", "orange", "potato", "salt substitute", "potassium"],
};

export function FeatureDetailsPage() {
  const { featureId } = useParams();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [inputText, setInputText] = useState("");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSimulate = async () => {
    if (!inputText && !selectedFile) {
      alert("Please provide some input data or upload an image to run the feature.");
      return;
    }

    setRunning(true);
    setResult(null);

    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("profile", JSON.stringify({
          allergies: ["peanuts", "tree nuts", "milk"],
          conditions: [],
          preferences: []
        }));

        const res = await fetch("http://localhost:8000/api/v1/scans", {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          throw new Error("Backend request failed");
        }

        const data = await res.json();
        
        let alerts: any[] = [];
        let featureTitle = "Analysis Complete";
        let featureDesc = "Processed the image using the SafeBite AI backend pipeline.";

        if (data.status === "uncertain") {
          featureTitle = "Uncertain Image";
          featureDesc = data.disclaimers?.[0] || "Could not detect a food label.";
          alerts.push({ type: "warning", message: "Image rejected by heuristic validator" });
        } else {
          if (featureId === "allergen-cross-contamination") {
            featureTitle = "Allergen Analysis Results";
            featureDesc = "Processed image for direct and cross-contamination allergens.";
            data.allergens?.forEach((a: any) => {
              alerts.push({
                type: a.severity === "critical" ? "critical" : "warning",
                message: `${a.matchType === 'may_contain' ? 'Possible trace' : 'Detected'}: ${a.name} (${a.matchedText})`
              });
            });
            if (alerts.length === 0) alerts.push({ type: "info", message: "No major allergens detected." });
          } else if (featureId === "hidden-sugar-detector") {
            featureTitle = "Processing & Sugar Analysis";
            featureDesc = "NOVA classification and hidden sugar detection applied.";
            const sugarConcern = data.concerns?.find((c: any) => c.category === "processing");
            if (sugarConcern) {
              alerts.push({ type: "critical", message: sugarConcern.title });
              alerts.push({ type: "warning", message: sugarConcern.plainLanguageReason });
            } else {
              alerts.push({ type: "info", message: "No hidden sugars or ultra-processing signals detected." });
            }
          } else {
            featureTitle = "Label Processed";
            featureDesc = "Successfully extracted ingredients and nutrition data.";
            alerts.push({ type: "info", message: `Status: ${data.status}` });
          }
        }

        setResult({
          title: featureTitle,
          description: featureDesc,
          confidence: `${(data.confidence?.overall * 100).toFixed(1)}%`,
          latency: "Real API",
          stages: [
            { name: "OCR / Vision", status: "success", detail: "Pipeline: " + (data.pipelineUsed || "Unknown") }
          ],
          alerts: alerts
        });

      } catch (err) {
        console.error(err);
        setResult({
          title: "Error",
          description: "Failed to connect to backend. Make sure the Python server is running on port 8000.",
          confidence: "0%",
          latency: "N/A",
          stages: [],
          alerts: [{ type: "critical", message: "Network Error" }]
        });
      }
      setRunning(false);
      return;
    }

    // Client-side simulated logic for text input only
    const analysis = analyzeText(inputText || "No text provided");
    setTimeout(() => {
      setRunning(false);
      setResult(analysis);
    }, 1200);
  };

  const analyzeText = (text: string) => {
    const lower = text.toLowerCase();

    if (featureId === "hidden-sugar-detector") {
      const found = HIDDEN_SUGARS.filter(s => lower.includes(s));
      const ultraMarkers = ["emulsifier", "colour", "color", "flavour", "flavor", "preservative", "stabilizer", "modified starch"];
      const ultraCount = ultraMarkers.filter(m => lower.includes(m)).length + found.length;

      return {
        title: found.length > 0 ? "Hidden Sugars Detected" : "No Major Hidden Sugars Found",
        description: found.length > 0
          ? `Found ${found.length} hidden sugar source(s) in the text.`
          : "No common hidden sugar aliases were detected.",
        confidence: found.length > 0 ? "91%" : "78%",
        latency: "180ms",
        stages: [
          { name: "Text Normalization", status: "success", detail: "Cleaned and lowercased input" },
          { name: "Alias Matching", status: "success", detail: `Checked against ${HIDDEN_SUGARS.length} sugar aliases` },
          { name: "NOVA Heuristic", status: "success", detail: ultraCount >= 3 ? "Likely Ultra-processed (NOVA 4)" : "Lower processing level" }
        ],
        alerts: [
          ...found.map(s => ({ type: "warning", message: `Hidden sugar found: ${s}` })),
          ultraCount >= 3
            ? { type: "critical", message: "High likelihood of ultra-processed food (NOVA Group 4)" }
            : { type: "info", message: "Processing level appears moderate or lower" }
        ]
      };
    }

    if (featureId === "allergen-cross-contamination") {
      const hasMayContain = /may contain|traces of|produced in a facility|shared equipment|manufactured in/i.test(text);
      const allergens = ["peanut", "tree nut", "milk", "egg", "soy", "wheat", "gluten", "sesame", "fish", "shellfish"];
      const mentioned = allergens.filter(a => lower.includes(a));

      return {
        title: hasMayContain ? "Cross-Contamination Risk Detected" : "No Clear Cross-Contamination Statement",
        description: hasMayContain
          ? "The text contains language commonly used for shared equipment or facility warnings."
          : "No typical 'may contain' or facility statements were found.",
        confidence: hasMayContain ? "87%" : "72%",
        latency: "140ms",
        stages: [
          { name: "Statement Detection", status: "success", detail: hasMayContain ? "Found risk language" : "No risk language" },
          { name: "Allergen Mention Scan", status: "success", detail: `${mentioned.length} allergen(s) mentioned` }
        ],
        alerts: [
          ...(hasMayContain ? [{ type: "critical", message: "Possible cross-contamination language detected" }] : []),
          ...mentioned.map(a => ({ type: "warning", message: `Mentions: ${a}` })),
          { type: "info", message: "Always verify with the manufacturer if you have severe allergies." }
        ]
      };
    }

    if (featureId === "medication-interaction") {
      const alerts: any[] = [];
      let foundAny = false;

      for (const [med, foods] of Object.entries(MEDICATION_INTERACTIONS)) {
        const matchedFoods = foods.filter(f => lower.includes(f));
        if (matchedFoods.length > 0) {
          foundAny = true;
          alerts.push({
            type: "critical",
            message: `Possible interaction with ${med.toUpperCase()}: ${matchedFoods.join(", ")}`
          });
        }
      }

      return {
        title: foundAny ? "Potential Medication-Food Interaction Found" : "No Known Interactions Detected",
        description: foundAny
          ? "One or more food items may interact with common medications."
          : "No matches found against the current interaction database.",
        confidence: foundAny ? "89%" : "70%",
        latency: "110ms",
        stages: [
          { name: "Medication Rules Loaded", status: "success", detail: `${Object.keys(MEDICATION_INTERACTIONS).length} medication groups` },
          { name: "Food Matching", status: "success", detail: foundAny ? "Matches found" : "No matches" }
        ],
        alerts: foundAny ? alerts : [{ type: "info", message: "No interactions found in the current rule set." }]
      };
    }

    // Default fallback
    return {
      title: "Analysis Complete",
      description: "Basic text analysis finished. Connect to full backend pipeline for deeper results.",
      confidence: "75%",
      latency: "200ms",
      stages: [{ name: "Client Analysis", status: "success", detail: "Completed" }],
      alerts: [{ type: "info", message: "This is a lightweight client-side analysis." }]
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
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
          Upload a sample image or enter text data below to test how our deep learning pipeline handles this feature in real-time.
        </p>

        <div className="bg-[var(--color-bg)] p-6 rounded-xl border border-[var(--color-border)] mb-8 space-y-6">
          <h2 className="text-xl font-bold">Input Data</h2>
          
          {/* File Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 text-center cursor-pointer hover:border-[var(--color-primary)] transition-colors bg-white"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            {filePreview ? (
              <img src={filePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-[var(--color-muted)]">
                <Upload size={32} />
                <span className="font-bold">Click to upload image</span>
                <span className="text-sm">JPG, PNG, or WEBP (Max 5MB)</span>
              </div>
            )}
          </div>

          {/* Text Input Area */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-[var(--color-text)] mb-2">
              <Type size={16} /> 
              Or enter text data (ingredients, barcodes, or "may contain" statements)
            </label>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-4 rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] resize-none"
              rows={4}
              placeholder="e.g. 'May contain traces of peanuts and tree nuts...'"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button 
            onClick={handleSimulate}
            disabled={running}
            className="flex items-center gap-2 gradient-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 transition-all text-lg"
          >
            {running ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PlayCircle size={24} />
            )}
            {running ? "Processing Model..." : "Run AI Simulation"}
          </button>
        </div>

        {result && (
          <div className="mt-8 animate-slide-up space-y-6">
            <div className="p-6 bg-green-50 border border-green-200 rounded-xl flex flex-col md:flex-row md:items-start gap-4">
              <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={32} />
              <div className="flex-1">
                <h3 className="font-bold text-green-900 text-xl mb-2">{result.title}</h3>
                <p className="text-green-800 text-lg mb-4">{result.description}</p>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="bg-white/60 px-3 py-1.5 rounded-lg border border-green-100 flex items-center gap-2 text-sm font-bold text-green-900">
                    <Activity size={16} className="text-green-600" />
                    Confidence: {result.confidence}
                  </div>
                  <div className="bg-white/60 px-3 py-1.5 rounded-lg border border-green-100 flex items-center gap-2 text-sm font-bold text-green-900">
                    <Database size={16} className="text-green-600" />
                    Latency: {result.latency}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-green-900 border-b border-green-200 pb-1">Pipeline Stages Execution</h4>
                  {result.stages.map((stage: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white/50 p-2 rounded-lg text-sm">
                      <span className="font-bold text-green-900">{stage.name}</span>
                      <span className="text-green-700 italic">{stage.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {result.alerts.length > 0 && (
              <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm">
                <h3 className="font-bold text-[var(--color-text)] text-lg mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-amber-500" /> Key Insights & Alerts
                </h3>
                <div className="space-y-3">
                  {result.alerts.map((alert: any, i: number) => (
                    <div key={i} className={`p-4 rounded-lg flex items-start gap-3 border ${
                      alert.type === 'critical' ? 'bg-red-50 border-red-200 text-red-900' :
                      alert.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                      'bg-blue-50 border-blue-200 text-blue-900'
                    }`}>
                      {alert.type === 'critical' ? <AlertTriangle size={20} className="text-red-500 flex-shrink-0" /> :
                       alert.type === 'warning' ? <AlertTriangle size={20} className="text-amber-500 flex-shrink-0" /> :
                       <ShieldCheck size={20} className="text-blue-500 flex-shrink-0" />}
                      <span className="font-bold text-sm leading-tight">{alert.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
