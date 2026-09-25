import { supabase } from './supabase';
import type { LoggedMeal } from '../features/tracker/tracker.store';

// Helper to get current user ID
export const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
};

// Profile Helpers
export const getProfile = async () => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateProfile = async (updates: any) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateGoals = async (goals: { calorie_goal?: number; protein_goal?: number; carbs_goal?: number; fat_goal?: number }) => {
  return updateProfile(goals);
};

// Meal Helpers
export const saveMeal = async (meal: Partial<LoggedMeal>, scanType: 'label' | 'meal' = 'meal', rawData: any = {}) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from('meals')
    .insert({
      user_id: userId,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      food_names: meal.foodNames || [],
      calories: meal.calories || 0,
      protein: meal.protein || 0,
      carbs: meal.carbs || 0,
      fat: meal.fat || 0,
      scan_type: scanType,
      raw_data: rawData
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTodayMeals = async () => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data;
};

export const getMealsByDateRange = async (startDate: string, endDate: string) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteMeal = async (mealId: string) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");

  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', mealId)
    .eq('user_id', userId);

  if (error) throw error;
  return true;
};
