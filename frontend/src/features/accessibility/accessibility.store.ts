import { create } from "zustand";

interface AccessibilityState {
  largeText: boolean;
  highContrast: boolean;
  voiceReadout: boolean;
  toggleLargeText: () => void;
  toggleHighContrast: () => void;
  toggleVoiceReadout: () => void;
  load: () => void;
}

const STORAGE_KEY = "safebite_accessibility";

function applyClasses(largeText: boolean, highContrast: boolean) {
  const root = document.documentElement;
  root.classList.toggle("large-text", largeText);
  root.classList.toggle("high-contrast", highContrast);
}

export const useAccessibilityStore = create<AccessibilityState>((set, get) => ({
  largeText: false,
  highContrast: false,
  voiceReadout: false,
  toggleLargeText: () => {
    const next = !get().largeText;
    set({ largeText: next });
    applyClasses(next, get().highContrast);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), largeText: next }));
  },
  toggleHighContrast: () => {
    const next = !get().highContrast;
    set({ highContrast: next });
    applyClasses(get().largeText, next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), highContrast: next }));
  },
  toggleVoiceReadout: () => {
    const next = !get().voiceReadout;
    set({ voiceReadout: next });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), voiceReadout: next }));
  },
  load: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        set(parsed);
        applyClasses(parsed.largeText, parsed.highContrast);
      }
    } catch {}
  },
}));
