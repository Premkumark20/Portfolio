import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://rakwmqpwfdlydhtazfzp.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJha3dtcXB3ZmRseWRodGF6ZnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1OTI0NDYsImV4cCI6MjEwMTE2ODQ0Nn0.yvzYqyn9IToHjFlchKec29nFCiS8-O8EfrVtQI7URnE';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
