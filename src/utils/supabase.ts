import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('health_check')
      .select('status')
      .limit(1)
      .single();

    if (error) {
      console.warn('Database check failed:', error);
      return false;
    }

    return data?.status === 'ok';
  } catch (error) {
    console.warn('Database error:', error);
    return false;
  }
}