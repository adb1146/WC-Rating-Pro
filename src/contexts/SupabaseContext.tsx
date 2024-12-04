import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, checkSupabaseConnection } from '../utils/supabase';
import { handleStorageError } from '../utils/storage/errorHandling';

interface SupabaseContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  signOut: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    async function initializeSupabase() {
      try {
        setLoading(true);
        setError(null);

        // Check connection first
        const connected = await checkSupabaseConnection();
        setIsConnected(connected);

        if (!connected) {
          const error = handleStorageError(new Error('Database connection failed'));
          setError(error.message);
          setLoading(false);
          return;
        }

        // Get session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setError(null);
        setLoading(false);
      } catch (error) {
        const storageError = handleStorageError(error);
        console.error('Error initializing Supabase:', storageError);
        setError(storageError.message);
        setLoading(false);
      }
    }

    initializeSupabase();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setError(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    isConnected,
    error,
    signOut: () => supabase.auth.signOut(),
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