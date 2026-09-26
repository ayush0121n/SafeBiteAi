import { create } from "zustand";
import type { UserProfile } from "../../api/types";

const STORAGE_KEY = "safebite_profile";

function loadProfile(): UserProfile {
  const defaultProfile: UserProfile = {
    id: crypto.randomUUID(),
    allergies: [],
    allergySeverity: {},
    medications: [],
    dietGoals: [],
    conditions: [],
    preferences: [],
    accessibility: { largeText: false, highContrast: false, voiceReadout: false },
  };
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultProfile, ...parsed };
    }
  } catch {}
  
  return defaultProfile;
}

interface ProfileStore {
  profile: UserProfile;
  setAllergies: (allergies: string[]) => void;
  setAllergySeverity: (severity: NonNullable<UserProfile["allergySeverity"]>) => void;
  setMedications: (medications: string[]) => void;
  setDietGoals: (goals: string[]) => void;
  setConditions: (conditions: UserProfile["conditions"]) => void;
  setPreferences: (preferences: UserProfile["preferences"]) => void;
  setAccessibility: (a: UserProfile["accessibility"]) => void;
  save: () => void;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: loadProfile(),
  setAllergies: (allergies) =>
    set((s) => ({ profile: { ...s.profile, allergies } })),
  setAllergySeverity: (allergySeverity) =>
    set((s) => ({ profile: { ...s.profile, allergySeverity } })),
  setMedications: (medications) =>
    set((s) => ({ profile: { ...s.profile, medications } })),
  setDietGoals: (dietGoals) =>
    set((s) => ({ profile: { ...s.profile, dietGoals } })),
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
