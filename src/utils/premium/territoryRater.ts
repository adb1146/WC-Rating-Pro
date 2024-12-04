import { Address } from '../../types';
import { supabase } from '../supabase';

interface TerritoryRate {
  territoryCode: string;
  rateMultiplier: number;
  description: string;
}

export async function getTerritoryRate(location: Address): Promise<TerritoryRate> {
  try {
    // Get all territories for the state
    const { data: territories, error } = await supabase
      .from('territories')
      .select('*')
      .eq('state_code', location.state)
      .eq('effective_date', '2024-01-01');  // Use current rating period

    if (error) throw error;

    // Default to base rate if no territories found
    if (!territories?.length) {
      return {
        territoryCode: location.state + '-BASE',
        rateMultiplier: 1.0,
        description: 'Base Rate Territory'
      };
    }

    // Find best matching territory based on ZIP code ranges and city
    const matchedTerritory = await findBestTerritoryMatch(location, territories);
    
    return {
      territoryCode: matchedTerritory.territory_code,
      rateMultiplier: matchedTerritory.rate_multiplier,
      description: matchedTerritory.description
    };
  } catch (error) {
    console.error('Territory rating error:', error);
    // Return safe default if error occurs
    return {
      territoryCode: location.state + '-BASE',
      rateMultiplier: 1.0,
      description: 'Base Rate Territory (Error Fallback)'
    };
  }
}

async function findBestTerritoryMatch(location: Address, territories: any[]): Promise<any> {
  // First try exact city match
  const cityMatch = territories.find(t => 
    t.description.toLowerCase().includes(location.city.toLowerCase())
  );
  
  if (cityMatch) return cityMatch;

  // Then check ZIP code ranges
  const zipMatches = territories.filter(t => {
    if (t.zip_ranges) {
      return t.zip_ranges.some((range: any) => 
        parseInt(location.zipCode) >= range.start && 
        parseInt(location.zipCode) <= range.end
      );
    }
    return false;
  });

  if (zipMatches.length) {
    // Return highest rate multiplier if multiple matches
    return zipMatches.reduce((prev, curr) => 
      curr.rate_multiplier > prev.rate_multiplier ? curr : prev
    );
  }

  // Default to rural/base rate territory
  return territories.find(t => 
    t.territory_code.endsWith('-RUR') || 
    t.territory_code.endsWith('-BASE')
  ) || territories[0];
}