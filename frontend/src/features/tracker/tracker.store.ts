import { create } from "zustand";
import { saveMeal, getTodayMeals, getProfile, updateGoals, deleteMeal } from "../lib/database";

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
  loading: boolean;
  loadSupabaseData: () => Promise<void>;
  addLog: (meal: Omit<LoggedMeal, "id" | "timestamp">) => Promise<void>;
  removeLog: (id: string) => Promise<void>;
  setGoals: (goals: TrackerGoals) => Promise<void>;
}

function loadLocalState() {
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
  const initial = loadLocalState();
  return {
    logs: initial.logs,
    goals: initial.goals,
    loading: false,

    loadSupabaseData: async () => {
      set({ loading: true });
      try {
        const [profile, meals] = await Promise.all([getProfile(), getTodayMeals()]);
        
        const goals = {
          calories: profile.calorie_goal || 2000,
          protein: profile.protein_goal || 120,
          carbs: profile.carbs_goal || 250,
          fat: profile.fat_goal || 65,
        };

        const logs = meals.map((m: any) => ({
          id: m.id,
          name: m.food_names?.[0] || "Meal",
          calories: m.calories || 0,
          protein: m.protein || 0,
          carbs: m.carbs || 0,
          fat: m.fat || 0,
          timestamp: m.timestamp,
        }));

        set({ logs, goals, loading: false });
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ logs, goals }));
      } catch (err) {
        console.error("Failed to load tracker data from Supabase, using local fallback", err);
        set({ loading: false });
      }
    },

    addLog: async (meal) => {
      // Optimistic update
      const tempId = crypto.randomUUID();
      const newMeal = {
        ...meal,
        id: tempId,
        timestamp: new Date().toISOString(),
      };
      
      set((s) => {
        const newLogs = [newMeal, ...s.logs];
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ logs: newLogs, goals: s.goals }));
        return { logs: newLogs };
      });

      try {
        // Persist to Supabase
        const saved = await saveMeal({
          foodNames: [meal.name],
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat
        }, "meal");
        
        // Update temporary ID with real ID
        set((s) => ({
          logs: s.logs.map(l => l.id === tempId ? { ...l, id: saved.id } : l)
        }));
      } catch (err) {
        console.error("Failed to sync meal to Supabase", err);
      }
    },

    removeLog: async (id) => {
      set((s) => {
        const newLogs = s.logs.filter((l) => l.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ logs: newLogs, goals: s.goals }));
        return { logs: newLogs };
      });

      try {
        await deleteMeal(id);
      } catch (err) {
        console.error("Failed to delete meal from Supabase", err);
      }
    },

    setGoals: async (goals) => {
      set((s) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ logs: s.logs, goals }));
        return { goals };
      });

      try {
        await updateGoals({
          calorie_goal: goals.calories,
          protein_goal: goals.protein,
          carbs_goal: goals.carbs,
          fat_goal: goals.fat
        });
      } catch (err) {
        console.error("Failed to sync goals to Supabase", err);
      }
    },
  };
});
