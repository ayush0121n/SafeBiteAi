import { useParams, Link } from "react-router-dom";
import { ArrowLeft, PlayCircle, CheckCircle, Upload, Type } from "lucide-react";
import { useState, useRef } from "react";

export function FeatureDetailsPage() {
  const { featureId } = useParams();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
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
      
      let res = `Simulation completed successfully! Analyzed ${filePreview ? 'image data' : 'text input'} with 94.2% confidence. Model identified key attributes matching SafeBite's safety standards.`;
      
      if (featureId === "allergen-cross-contamination") {
        res = "Allergen Output: Detected vague 'may contain nuts' statement via OCR. Cross-referenced with DB. Probability of peanut trace: High (84%). Caution advised for nut allergies.";
      } else if (featureId === "hidden-sugar-detector") {
        res = "Sugar Output: Identified 'Maltodextrin' and 'Dextrose' in ingredient list. NOVA classification: Group 4 (Ultra-processed). Sugar density score: 7/10.";
      } else if (featureId === "medication-interaction") {
        res = "Medication Output: Detected grapefruit extract. Warning: Known severe interaction with Statins. Alert triggered.";
      } else if (featureId === "plate-macro-estimate") {
        res = "Plate Output: ViT model recognized Grilled Salmon and Quinoa. Estimated macros: 420 kcal, 35g Protein, 25g Carbs, 18g Fat.";
      } else if (featureId === "real-time-label-quality") {
        res = "Quality Output: Image sharpness score is 89/100. Lighting is adequate. Label is readable. OCR engine cleared for processing.";
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
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl flex items-start gap-4 animate-slide-up">
            <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={28} />
            <div>
              <h3 className="font-bold text-green-900 text-lg mb-1">AI Pipeline Success</h3>
              <p className="text-green-800">{result}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
