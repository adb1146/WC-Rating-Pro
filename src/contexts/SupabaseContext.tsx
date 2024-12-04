import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { checkSupabaseConnection, supabase } from '../utils/supabase';

interface SupabaseContextType {
  user: User | null;
  loading: boolean;
  isConnected: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeSupabase() {
      try {
        // Check connection first
        const connected = await checkSupabaseConnection();
        setIsConnected(connected);

        if (!connected) {
          setError('Database connection failed');
          setLoading(false);
          return;
        }

        // Get session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setError(null);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing Supabase:', error);
        setIsConnected(false);
        setError('Failed to initialize Supabase');
        setLoading(false);
      }
    }

    initializeSupabase();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsConnected(!!session?.user);
      
      if (event === 'SIGNED_IN') {
        setError(null);
      } else if (event === 'SIGNED_OUT') {
        setError('Please sign in');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Clear any stored auth data
      localStorage.removeItem('sb-osbpcojswvrpncsywbzw-auth-token');
      // Force a page reload to clear React state
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isConnected,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {!loading && (isConnected || !error ? children : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Connection Error</h2>
            <p className="text-gray-600 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Retry Connection
            </button>
          </div>
        </div>
      ))}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}