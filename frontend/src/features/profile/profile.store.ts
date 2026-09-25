import { create } from "zustand";
import type { UserProfile } from "../../api/types";

const STORAGE_KEY = "safebite_profile";

function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    id: crypto.randomUUID(),
    allergies: [],
    conditions: [],
    preferences: [],
    accessibility: { largeText: false, highContrast: false, voiceReadout: false },
  };
}

interface ProfileStore {
  profile: UserProfile;
  setAllergies: (allergies: string[]) => void;
  setConditions: (conditions: UserProfile["conditions"]) => void;
  setPreferences: (preferences: UserProfile["preferences"]) => void;
  setAccessibility: (a: UserProfile["accessibility"]) => void;
  save: () => void;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: loadProfile(),
  setAllergies: (allergies) =>
    set((s) => ({ profile: { ...s.profile, allergies } })),
  setConditions: (conditions) =>
    set((s) => ({ profile: { ...s.profile, conditions } })),
  setPreferences: (preferences) =>
    set((s) => ({ profile: { ...s.profile, preferences } })),
  setAccessibility: (accessibility) =>
    set((s) => ({ profile: { ...s.profile, accessibility } })),
  save: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(get().profile));
  },
}));
