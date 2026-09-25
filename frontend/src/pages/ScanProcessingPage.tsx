import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function ScanProcessingPage() {
  const navigate = useNavigate();
  const { scanId } = useParams();

  useEffect(() => {
    // Mock processing delay
    const timer = setTimeout(() => {
      navigate(`/app/scan/${scanId}`);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [navigate, scanId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
      <Loader2 size={64} className="text-[#4E8F68] animate-spin" />
      <div>
        <h2 className="text-3xl font-bold text-[#19352a] mb-2">Analyzing Label...</h2>
        <p className="text-[#6D7B73] text-lg max-w-sm mx-auto">
          We're reading the ingredients and checking them against your health profile.
        </p>
      </div>
    </div>
  );
}
