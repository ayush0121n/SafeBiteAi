import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing Supabase credentials in Vercel. Falling back to mock client to prevent crash on boot.");
}

// Provide fallback mock strings if undefined to prevent fatal crash on boot
export const supabase = createClient(
  supabaseUrl || 'https://mock.supabase.co',
  supabaseKey || 'mock-key-12345'
);
