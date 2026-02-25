import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://kokxibcrfbxtekoxyjpm.supabase.co').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtva3hpYmNyZmJ4dGVrb3h5anBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMDMzNDgsImV4cCI6MjA4NzU3OTM0OH0.8a4HWs0gnGRi9DIlafdtkoh63-j2oudkxKTUejC4rY8').trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

// Only create client if URL is provided to avoid "supabaseUrl is required" error
export const supabase = supabaseUrl 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null as any;
