import { UploadCloud, Info, Image as ImageIcon, X, Camera, RefreshCcw } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "../features/profile/profile.store";
import { createScan, createMealScan } from "../api/client";

export function NewScanPage() {
  const navigate = useNavigate();
  const profile = useProfileStore((s) => s.profile);
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [scanMode, setScanMode] = useState<"label" | "meal">("label");
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const MAX_SIZE = 10 * 1024 * 1024;
  const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

  const processFile = useCallback((f: File) => {
    setError(null);
    if (!ALLOWED.includes(f.type)) {
      setError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("Image must be smaller than 10 MB.");
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    stopCamera();
  };
  
  const startCamera = async () => {
    setIsCameraActive(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setError("Could not access camera. Please allow permissions or use file upload.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            processFile(capturedFile);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError(null);

    try {
      if (scanMode === "label") {
        const res = await createScan(file, JSON.stringify(profile), privacyMode);
        navigate(`/app/scan/${res.scanId}`, { state: { result: res } });
      } else {
        const res = await createMealScan(file);
        navigate(`/app/meal/results`, { state: { result: res } });
      }
    } catch (err: any) {
      setError(err.message || `Failed to analyze ${scanMode}. Please try again.`);
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mode Toggle Tabs */}
      <div className="flex bg-[var(--color-surface)] p-1 rounded-xl border border-[var(--color-border)] shadow-sm">
        <button
          onClick={() => { setScanMode("label"); clearFile(); }}
          className={`flex-1 py-3 font-bold text-sm rounded-lg transition-colors ${
            scanMode === "label" 
              ? "bg-[var(--color-bg)] text-[var(--color-text)] shadow-sm border border-[var(--color-border)]" 
              : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          🏷️ Scan Label
        </button>
        <button
          onClick={() => { setScanMode("meal"); clearFile(); }}
          className={`flex-1 py-3 font-bold text-sm rounded-lg transition-colors ${
            scanMode === "meal" 
              ? "bg-[var(--color-bg)] text-[var(--color-text)] shadow-sm border border-[var(--color-border)]" 
              : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          🍽️ Scan Meal / Plate
        </button>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-1">
          {scanMode === "label" ? "Scan a Food Label" : "Scan Your Meal"}
        </h2>
        <p className="text-[var(--color-muted)] text-lg">
          {scanMode === "label" 
            ? "Upload a clear photo of the ingredients list or nutrition panel."
            : "Take a photo of your plate to detect foods and estimate calories."}
        </p>
      </section>

      {/* Upload Zone */}
      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`bg-[var(--color-surface)] rounded-2xl p-10 border-2 border-dashed text-center transition-all ${
            dragActive
              ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] scale-[1.01]"
              : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
          }`}
        >
          
          {/* Upload Zone Buttons */}
          <UploadCloud size={56} className="mx-auto text-[var(--color-primary)] mb-4" />
          <p className="text-[var(--color-text)] font-bold text-xl mb-2">
            Drop your label photo here
          </p>
          <p className="text-[var(--color-muted)] mb-6">or</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isMobile ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                  id="mobile-camera-upload"
                />
                <label
                  htmlFor="mobile-camera-upload"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 gradient-primary text-white font-bold py-3 px-6 rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all"
                >
                  <Camera size={20} />
                  Take Photo
                </label>
              </>
            ) : (
              <button
                onClick={startCamera}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 gradient-primary text-white font-bold py-3 px-6 rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                <Camera size={20} />
                Use Camera
              </button>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              id="label-upload"
            />
            <label
              htmlFor="label-upload"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--color-bg)] text-[var(--color-text)] font-bold py-3 px-6 rounded-xl border-2 border-[var(--color-border)] cursor-pointer hover:border-[var(--color-primary)] transition-colors"
            >
              <ImageIcon size={20} />
              Upload File
            </label>
          </div>

          <p className="text-sm text-[var(--color-muted)] mt-4">JPG, PNG, or WEBP · Max 10 MB</p>
        </div>
      ) : (
        /* Preview */
        <div className="bg-[var(--color-surface)] rounded-2xl overflow-hidden border border-[var(--color-border)] animate-slide-up">
          <div className="relative">
            <img src={preview} alt="Label preview" className="w-full max-h-[300px] object-contain bg-[var(--color-bg)]" />
            <button
              onClick={clearFile}
              className="absolute top-3 right-3 bg-[var(--color-surface)] p-2 rounded-full shadow-lg hover:bg-[var(--color-bg)] transition-colors"
              aria-label="Remove image"
            >
              <X size={20} className="text-[var(--color-text)]" />
            </button>
          </div>
          <div className="p-4">
            <p className="font-bold text-[var(--color-text)] truncate">{file?.name}</p>
            <p className="text-sm text-[var(--color-muted)]">
              {file && (file.size / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-[var(--color-avoid-bg)] text-[var(--color-avoid)] p-4 rounded-xl font-bold flex items-center gap-2" role="alert">
          <Info size={20} />
          {error}
        </div>
      )}

      {/* Analyze Button */}
      {file && !analyzing && (
        <div className="space-y-4 animate-slide-up">
          <label className="flex items-center gap-3 p-4 border border-[var(--color-border)] rounded-xl cursor-pointer bg-[var(--color-surface)] hover:bg-[var(--color-bg)] transition-colors">
            <input 
              type="checkbox" 
              checked={privacyMode} 
              onChange={(e) => setPrivacyMode(e.target.checked)}
              className="w-5 h-5 accent-[var(--color-primary)]"
            />
            <div>
              <p className="font-bold text-[var(--color-text)]">Privacy-first mode</p>
              <p className="text-sm text-[var(--color-muted)]">Analyze without saving the image to the server</p>
            </div>
          </label>
          <button
            onClick={handleAnalyze}
            className="w-full gradient-primary text-white text-xl font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            Analyze Label
          </button>
        </div>
      )}

      {/* Analyzing State */}
      {analyzing && (
        <div className="bg-[var(--color-surface)] rounded-2xl p-8 text-center border border-[var(--color-border)] animate-fade-in">
          <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Analyzing your label...</h3>
          <p className="text-[var(--color-muted)]">
            Sending to SafeBite AI for personalized checking.
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="bg-[var(--color-surface)] p-5 rounded-2xl border border-[var(--color-border)] flex items-start gap-3">
        <Info className="text-[var(--color-primary)] mt-0.5 flex-shrink-0" size={22} />
        <div>
          <h4 className="font-bold text-[var(--color-text)] mb-2">Tips for a better result</h4>
          <ul className="text-[var(--color-muted)] space-y-1 list-disc list-inside">
            <li>Keep the label flat and well-lit</li>
            <li>Make the text fill most of the image</li>
            <li>Avoid shadows and glare</li>
            <li>Upload a second photo if ingredients and nutrition are on different sides</li>
          </ul>
        </div>
      </div>

      {/* Camera Modal */}
      {isCameraActive && !isMobile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-[var(--color-surface)] p-4 rounded-3xl w-full max-w-3xl flex flex-col gap-4 shadow-2xl relative border border-[var(--color-border)]">
            <button onClick={stopCamera} className="absolute top-6 right-6 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10 transition">
              <X size={24} />
            </button>
            <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-[var(--color-border)]">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex justify-center mt-2">
              <button
                onClick={capturePhoto}
                className="inline-flex items-center gap-2 gradient-primary text-white font-bold py-4 px-10 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 text-lg"
              >
                <Camera size={24} />
                Capture Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
