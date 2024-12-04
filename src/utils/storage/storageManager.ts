import { Quote, SavedRating } from '../../types';
import { supabase } from '../supabase';
import { handleStorageError } from './errorHandling';

interface StorageManager {
  saveQuote(quote: Quote): Promise<void>;
  getQuotes(): Promise<Quote[]>;
  saveRating(rating: SavedRating): Promise<void>;
  getRatings(): Promise<SavedRating[]>;
  getQuoteCount(ratingId: string): Promise<number>;
  updateStatus(id: string, status: string, type: 'quote' | 'rating'): Promise<void>;
}

class SupabaseStorageManager implements StorageManager {
  async saveQuote(quote: Quote): Promise<void> {
    try {
      // Validate connection first
      if (!supabase) {
        throw new Error('Storage service not initialized');
      }

      const { error } = await supabase
        .from('quotes')
        .insert([{
          id: quote.id,
          quote_number: quote.quoteNumber,
          business_info: quote.businessInfo,
          premium: quote.premium,
          effective_date: quote.effectiveDate,
          expiration_date: quote.expirationDate,
          status: quote.status,
          created_at: new Date().toISOString(),
          rating_id: quote.ratingId
        }]);

      if (error) throw error;
    } catch (error) {
      throw handleStorageError(error);
    }
  }

  async getQuotes(): Promise<Quote[]> {
    try {
      // Validate connection first
      if (!supabase) {
        throw new Error('Storage service not initialized');
      }

      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw handleStorageError(error);
    }
  }

  async saveRating(rating: SavedRating): Promise<void> {
    try {
      if (!supabase) {
        throw new Error('Storage service not initialized');
      }

      const { error } = await supabase
        .from('ratings')
        .insert([{
          id: rating.id,
          business_info: rating.businessInfo,
          saved_at: new Date().toISOString(),
          total_premium: rating.totalPremium,
          status: rating.status
        }]);

      if (error) throw error;
    } catch (error) {
      throw handleStorageError(error);
    }
  }

  async getRatings(): Promise<SavedRating[]> {
    try {
      if (!supabase) {
        throw new Error('Storage service not initialized');
      }

      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .order('saved_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw handleStorageError(error);
    }
  }

  async getQuoteCount(ratingId: string): Promise<number> {
    try {
      if (!supabase) {
        throw new Error('Storage service not initialized');
      }

      const { count, error } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .eq('rating_id', ratingId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      throw handleStorageError(error);
    }
  }

  async updateStatus(id: string, status: string, type: 'quote' | 'rating'): Promise<void> {
    try {
      if (!supabase) {
        throw new Error('Storage service not initialized');
      }

      const { error } = await supabase
        .from(type === 'quote' ? 'quotes' : 'ratings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw handleStorageError(error);
    }
  }
}

export const storageManager = new SupabaseStorageManager();