import { createClient } from '@supabase/supabase-js';
import { handleStorageError } from './storage/errorHandling';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
  auth: {
    persistSession: false // Disable session persistence for better error handling
  }
});

export { supabase };

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
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

    return data?.status === 'ok';
  } catch (error) {
    const storageError = handleStorageError(error);
    console.warn('Database error:', storageError);
    return false;
  }
}

export async function updateHealthCheck(
  status: 'ok' | 'error' | 'maintenance',
  details?: Record<string, any>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('health_check')
      .update({ 
        status,
        details: details || {},
        last_checked: new Date().toISOString()
      })
      .eq('id', 1);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating health check:', error);
    throw error;
  }
}