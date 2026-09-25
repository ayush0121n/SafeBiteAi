import { create } from "zustand";

export interface LoggedMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string;
}

export interface TrackerGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const STORAGE_KEY = "safebite_tracker";

interface TrackerState {
  logs: LoggedMeal[];
  goals: TrackerGoals;
  addLog: (meal: Omit<LoggedMeal, "id" | "timestamp">) => void;
  removeLog: (id: string) => void;
  setGoals: (goals: TrackerGoals) => void;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    logs: [],
    goals: { calories: 2000, protein: 120, carbs: 250, fat: 65 },
  };
}

export const useTrackerStore = create<TrackerState>((set, get) => {
  const initial = loadState();
  return {
    logs: initial.logs,
    goals: initial.goals,
    addLog: (meal) =>
      set((s) => {
        const newLogs = [
          ...s.logs,
          {
            ...meal,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          },
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ logs: newLogs, goals: s.goals }));
        return { logs: newLogs };
      }),
    removeLog: (id) =>
      set((s) => {
        const newLogs = s.logs.filter((l) => l.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ logs: newLogs, goals: s.goals }));
        return { logs: newLogs };
      }),
    setGoals: (goals) =>
      set((s) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ logs: s.logs, goals }));
        return { goals };
      }),
  };
});
