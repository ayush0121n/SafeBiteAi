import { useParams, Link } from "react-router-dom";
import { ArrowLeft, PlayCircle, CheckCircle, Upload, Type, Activity, Database, AlertTriangle, ShieldCheck } from "lucide-react";
import { useState, useRef } from "react";

export function FeatureDetailsPage() {
  const { featureId } = useParams();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [inputText, setInputText] = useState("");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSimulate = () => {
    if (!inputText && !filePreview) {
      alert("Please provide some input data or upload an image to run the feature.");
      return;
    }

    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setRunning(false);
      
      let res: any = {
        title: "Simulation completed successfully",
        description: `Analyzed ${filePreview ? 'image data' : 'text input'} with high confidence. Model identified key attributes matching SafeBite's safety standards.`,
        confidence: "94.2%",
        latency: "420ms",
        stages: [
          { name: "Image Preprocessing", status: "success", detail: "Sharpening & Contrast Adjusted" },
          { name: "OCR / Vision Model", status: "success", detail: "Text extracted successfully" }
        ],
        alerts: []
      };
      
      if (featureId === "allergen-cross-contamination") {
        res.title = "High Risk of Cross-Contamination Detected";
        res.description = "The pipeline identified vague allergen statements commonly associated with shared equipment.";
        res.confidence = "84.5%";
        res.stages.push({ name: "Cross-Reference DB", status: "success", detail: "Matched known manufacturer facility data" });
        res.alerts = [
          { type: "critical", message: "Detected: 'May contain nuts'" },
          { type: "warning", message: "Probability of peanut trace: High (84%)" },
          { type: "info", message: "Recommendation: Avoid if severe nut allergy is present." }
        ];
      } else if (featureId === "hidden-sugar-detector") {
        res.title = "Hidden Sugars Identified";
        res.description = "The system successfully parsed disguised sugar aliases from the ingredient block.";
        res.confidence = "98.1%";
        res.stages.push({ name: "NLP Alias Matching", status: "success", detail: "Found 2 hidden sugar variants" });
        res.alerts = [
          { type: "warning", message: "Identified 'Maltodextrin' and 'Dextrose'" },
          { type: "critical", message: "NOVA classification: Group 4 (Ultra-processed)" },
          { type: "info", message: "Sugar density score: 7/10 (High)" }
        ];
      } else if (featureId === "medication-interaction") {
        res.title = "Severe Medication Interaction Alert";
        res.description = "Food compounds detected that may interfere with known prescription pathways.";
        res.confidence = "99.9%";
        res.stages.push({ name: "Pharmacokinetics DB Query", status: "success", detail: "Checked against top 500 drug interactions" });
        res.alerts = [
          { type: "critical", message: "Detected: Grapefruit Extract" },
          { type: "critical", message: "Known severe interaction with Statins (CYP3A4 inhibition)" },
          { type: "warning", message: "Alert automatically triggered for user profiles with Statin prescriptions." }
        ];
      } else if (featureId === "plate-macro-estimate") {
        res.title = "Meal Segmented & Macros Estimated";
        res.description = "Vision transformer successfully isolated food items and estimated volume/weight.";
        res.confidence = "89.4%";
        res.latency = "850ms";
        res.stages.push({ name: "Semantic Segmentation", status: "success", detail: "2 primary food regions identified" });
        res.alerts = [
          { type: "info", message: "Detected: Grilled Salmon (est. 150g)" },
          { type: "info", message: "Detected: Quinoa (est. 100g)" },
          { type: "info", message: "Total Estimated Macros: 420 kcal | 35g Pro | 25g Carb | 18g Fat" }
        ];
      }
      
      setResult(res);
    }, 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
