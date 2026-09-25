import { create } from "zustand";
import type { ScanResult } from "../../api/types";

const STORAGE_KEY = "safebite_scans";

function loadScans(): ScanResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

interface ScansStore {
  scans: ScanResult[];
  addScan: (scan: ScanResult) => void;
  deleteScan: (scanId: string) => void;
}

export const useScansStore = create<ScansStore>((set, get) => ({
  scans: loadScans(),
  addScan: (scan) => {
    const updated = [scan, ...get().scans];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ scans: updated });
  },
  deleteScan: (scanId) => {
    const updated = get().scans.filter((s) => s.scanId !== scanId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ scans: updated });
  },
}));
