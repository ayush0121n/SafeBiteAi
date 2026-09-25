import { useScansStore } from "../features/scans/scans.store";
import { ShieldCheck, ShieldAlert, ShieldX, HelpCircle, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { ScanStatus } from "../api/types";

const statusIcons: Record<ScanStatus, { Icon: typeof ShieldCheck; color: string; label: string }> = {
  safe: { Icon: ShieldCheck, color: "text-[#4E9B69]", label: "Safe" },
  caution: { Icon: ShieldAlert, color: "text-[#E7A63F]", label: "Caution" },
  avoid: { Icon: ShieldX, color: "text-[#D95D59]", label: "Avoid" },
  uncertain: { Icon: HelpCircle, color: "text-[#687C8C]", label: "Uncertain" },
};

export function ScanHistoryPage() {
  const scans = useScansStore((s) => s.scans);
  const deleteScan = useScansStore((s) => s.deleteScan);

  if (scans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="bg-[#eef1f3] p-6 rounded-full">
          <HelpCircle size={48} className="text-[#687C8C]" />
        </div>
        <h2 className="text-2xl font-bold text-[#19352a]">No scans yet</h2>
        <p className="text-[#6D7B73] text-lg max-w-xs">
          Upload a food label photo to see your scan history here.
        </p>
        <Link
          to="/app/scan"
          className="bg-[#4E8F68] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#3d7052] transition-colors"
        >
          Scan a label
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[#19352a]">Scan History</h2>
      {scans.map((scan) => {
        const cfg = statusIcons[scan.status as ScanStatus];
        return (
          <div
            key={scan.scanId}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <Link to={`/app/scan/${scan.scanId}`} className="flex items-center gap-3 flex-1">
              <cfg.Icon size={28} className={cfg.color} />
              <div>
                <p className="font-bold text-[#19352a]">{scan.productName || "Food label"}</p>
                <p className="text-sm text-[#6D7B73]">
                  {cfg.label} · {new Date(scan.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
            <button
              onClick={() => deleteScan(scan.scanId)}
              className="p-2 text-[#6D7B73] hover:text-[#D95D59] transition-colors"
              aria-label="Delete scan"
            >
              <Trash2 size={20} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
