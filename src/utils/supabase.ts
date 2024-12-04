import { createClient } from '@supabase/supabase-js';
import { handleStorageError } from './storage/errorHandling';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: ReturnType<typeof createClient> | null = null;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables');
}

export function getSupabaseClient() {
  if (!supabaseInstance && supabaseUrl && supabaseKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseInstance;
}

export const supabase = getSupabaseClient();

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('health_check')
      .select('status')
      .limit(1)
      .single();

    if (error) {
      const storageError = handleStorageError(error);
      console.warn('Database check failed:', storageError);
      return false;
    }

    return data?.status === 'ok' || false;
  } catch (error) {
    const storageError = handleStorageError(error);
    console.warn('Database error:', storageError);
    return false;
  }
}