import { supabase } from './supabase';
import { validateBusinessName } from './ai/businessNameAssistant';

interface BusinessNameMatch {
  name: string;
  confidence: number;
  source: string;
  verified: boolean;
  industry?: string;
  entityType?: string;
}

export async function verifyBusinessName(partialName: string): Promise<BusinessNameMatch[]> {
  try {
    if (!partialName || partialName.length < 2) {
      return [];
    }
    
    // First validate the input name format
    const validation = validateBusinessName(partialName);
    if (!validation.isValid) {
      return [];
    }

    const { data: matches, error } = await supabase
      .from('verified_business_names')
      .rpc('search_business_names', { 
        search_query: partialName,
        min_similarity: 0.3
      })
      .gte('similarity', 0.3)
      .order('verified_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    return matches?.map(match => ({
      name: match.name,
      confidence: match.similarity || 0,
      source: match.source_url || 'Internal database',
      industry: match.industry,
      entityType: match.entity_type,
      verified: true
    })) || [];
  } catch (error) {
    if (error instanceof Error) {
      console.error('Business name verification error:', error.message);
    } else {
      console.error('Unknown error during business name verification');
    }
    return [];
  }
}

export async function searchBusinessNames(query: string): Promise<BusinessNameMatch[]> {
  try {
    const { data: matches, error } = await supabase
      .from('verified_business_names')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(10);

    if (error) throw error;

    return matches?.map(match => ({
      name: match.name,
      confidence: 1,
      source: match.source_url || '',
      verified: true,
      industry: match.industry,
      entityType: match.entity_type
    })) || [];
  } catch (error) {
    console.error('Error searching business names:', error);
    return [];
  }
}

export async function addVerifiedBusinessName(
  name: string,
  sourceUrl: string,
  industry: string,
  entityType: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('verified_business_names')
      .insert([{
        name,
        source_url: sourceUrl,
        industry,
        entity_type: entityType,
        verified_at: new Date().toISOString()
      }]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding verified business name:', error);
    return false;
  }
}