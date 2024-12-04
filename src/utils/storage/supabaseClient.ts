import { createClient } from '@supabase/supabase-js';
import { handleStorageError } from './errorHandling';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Missing Supabase environment variables');
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_KEY || '', {
  auth: {
    persistSession: false,
    autoRefreshToken: true
  },
  global: {
    headers: {
      'x-client-info': 'wc-rating-pro'
    }
  }
});

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function retryOperation<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await delay(RETRY_DELAY);
      return retryOperation(operation, retries - 1);
    }
    throw error;
  }
}

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const result = await retryOperation(async () => {
      const { data, error } = await supabase
        .from('health_check')
        .select('status')
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    });

    return result?.status === 'ok';
  } catch (error) {
    const storageError = handleStorageError(error);
    console.warn('Database error:', storageError);
    return false;
  }
}