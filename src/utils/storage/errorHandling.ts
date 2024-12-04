import { PostgrestError } from '@supabase/supabase-js';

export interface StorageError {
  code: string;
  message: string;
  suggestion?: string;
}

export const STORAGE_ERROR_CODES = {
  CONNECTION_ERROR: 'STORAGE_CONNECTION_ERROR',
  PERMISSION_ERROR: 'STORAGE_PERMISSION_ERROR',
  INITIALIZATION_ERROR: 'STORAGE_INITIALIZATION_ERROR',
  INITIALIZATION_ERROR: 'STORAGE_INITIALIZATION_ERROR',
  NOT_FOUND: 'STORAGE_NOT_FOUND',
  VALIDATION_ERROR: 'STORAGE_VALIDATION_ERROR',
  UNKNOWN_ERROR: 'STORAGE_UNKNOWN_ERROR',
} as const;

export function handleStorageError(error: unknown): StorageError {
  if (error instanceof Error) {
    if (error.message.includes('not initialized')) {
      return {
        code: STORAGE_ERROR_CODES.INITIALIZATION_ERROR,
        message: 'Storage service is not initialized',
        suggestion: 'Please check your environment configuration'
      };
    }

    const pgError = error as PostgrestError;
    
    if (pgError.code === '23505') {
      return {
        code: STORAGE_ERROR_CODES.VALIDATION_ERROR,
        message: 'A record with this identifier already exists',
        suggestion: 'Please use a unique identifier'
      };
    }
    
    if (pgError.code === '42501') {
      return {
        code: STORAGE_ERROR_CODES.PERMISSION_ERROR,
        message: 'Access denied',
        suggestion: 'Please check your permissions'
      };
    }

    if (pgError.code === '23503') {
      return {
        code: STORAGE_ERROR_CODES.VALIDATION_ERROR,
        message: 'Referenced record not found',
        suggestion: 'Please verify all referenced data exists'
      };
    }
  }
  
  // Handle unknown errors
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  return { 
    code: STORAGE_ERROR_CODES.UNKNOWN_ERROR,
    message: errorMessage,
    suggestion: 'Please try again or contact support if the issue persists'
  };
}