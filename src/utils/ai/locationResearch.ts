import { Address } from '../../types';
import { getOpenAIClient } from './config';
import { handleAIError, getFallbackLocationSuggestions } from './errorHandling';
import { supabase } from '../supabase';

interface PlaceDetails {
  address_components: google.maps.GeocoderAddressComponent[];
  formatted_address: string;
  place_id: string;
  geometry: google.maps.places.PlaceGeometry;
  types: string[];
  business_status?: string;
}

interface TerritoryRisk {
  rating: number;
  factors: string[];
}

interface LocationSuggestion {
  address: Address;
  confidence: number;
  businessPresence: boolean;
  nearbyBusinesses: string[];
  riskFactors: string[];
  territoryInfo?: TerritoryRisk;
}

async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const service = new google.maps.places.PlacesService(
    document.createElement('div')
  );

  return new Promise((resolve, reject) => {
    service.getDetails(
      {
        placeId,
        fields: ['address_components', 'formatted_address', 'geometry', 'types', 'business_status']
      },
      (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          resolve(result as PlaceDetails);
        } else {
          reject(status);
        }
      }
    );
  });
}

async function searchNearbyPlaces(
  location: google.maps.LatLng,
  radius: number = 1000,
  type?: string
): Promise<google.maps.places.PlaceResult[]> {
  const service = new google.maps.places.PlacesService(
    document.createElement('div')
  );

  return new Promise((resolve, reject) => {
    service.nearbySearch(
      {
        location,
        radius,
        type: type ? [type] : undefined
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          reject(status);
        }
      }
    );
  });
}

export async function researchBusinessLocation(
  businessDescription: string,
  state: string
): Promise<LocationSuggestion[]> {
  try {
    // First check if we have territory data for the state
    const { data: territories, error } = await supabase
      .from('territories')
      .select('*')
      .eq('state_code', state);

    if (error) throw error;

    const openai = await getOpenAIClient();
    if (!openai) {
      return getFallbackLocationSuggestions();
    }

    const prompt = `Research optimal business locations for:
Business Description: ${businessDescription}
State: ${state}
Available Territories: ${JSON.stringify(territories)}

Consider:
1. Industry concentration
2. Workforce availability
3. Risk factors
4. Regulatory requirements
5. Business ecosystem
6. Territory-specific factors

Format response as JSON with:
{
  "suggestions": [
    {
      "address": {
        "street1": "string",
        "city": "string",
        "state": "string",
        "zipCode": "string"
      },
      "confidence": number,
      "businessPresence": boolean,
      "nearbyBusinesses": ["string"],
      "riskFactors": ["string"]
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    
    // Enhance suggestions with Google Places data
    const enhancedSuggestions = await Promise.all(
      response.suggestions.map(async (suggestion: LocationSuggestion) => {
        try {
          // Get place details
          const geocoder = new google.maps.Geocoder();
          const { results } = await geocoder.geocode({
            address: `${suggestion.address.street1}, ${suggestion.address.city}, ${suggestion.address.state} ${suggestion.address.zipCode}`
          });

          if (results?.[0]) {
            const placeDetails = await getPlaceDetails(results[0].place_id);
            const location = placeDetails.geometry.location;

            // Get nearby businesses
            const nearbyPlaces = await searchNearbyPlaces(location);
            suggestion.nearbyBusinesses = nearbyPlaces
              .slice(0, 5)
              .map(place => place.name || 'Unknown business');

            // Analyze territory risk
            suggestion.territoryInfo = await analyzeTerritoryRisk(
              location,
              nearbyPlaces,
              businessDescription
            );
          }
        } catch (error) {
          console.error('Error enhancing location suggestion:', error);
        }
        return suggestion;
      })
    );

    return enhancedSuggestions;
  } catch (error) {
    const aiError = handleAIError(error);
    console.error('Location research error:', aiError);
    return getFallbackLocationSuggestions();
  }
}

export async function validateBusinessLocation(
  address: Address,
  businessType: string
): Promise<{
  isValid: boolean;
  riskFactors: string[];
  suggestions?: Address[];
}> {
  const service = new google.maps.places.PlacesService(
    document.createElement('div')
  );

  try {
    // Check zoning and business restrictions
    const nearbySearch = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
      const location = new google.maps.LatLng(0, 0); // Will be set from geocoding
      service.nearbySearch({
        location,
        radius: 1000,
        type: ['business']
      }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });

    // Analyze nearby businesses for risk factors
    const riskFactors = analyzeLocationRisks(nearbySearch, businessType);

    return {
      isValid: riskFactors.length === 0,
      riskFactors,
      suggestions: riskFactors.length > 0 ? await suggestAlternativeLocations(address, businessType) : undefined
    };
  } catch (error) {
    console.error('Location validation error:', error);
    return {
      isValid: true, // Default to valid if validation fails
      riskFactors: ['Unable to validate location']
    };
  }
}

function analyzeLocationRisks(
  nearbyPlaces: google.maps.places.PlaceResult[],
  businessType: string
): string[] {
  const risks: string[] = [];

  // Check business density
  if (nearbyPlaces.length > 50) {
    risks.push('High business density area - may affect premium');
  }

  // Check for hazardous neighbors
  const hazardousTypes = ['industrial', 'chemical', 'manufacturing'];
  const hasHazardousNeighbors = nearbyPlaces.some(place => 
    place.types?.some(type => hazardousTypes.includes(type))
  );
  
  if (hasHazardousNeighbors) {
    risks.push('Proximity to hazardous businesses');
  }

  return risks;
}

async function suggestAlternativeLocations(
  originalAddress: Address,
  businessType: string
): Promise<Address[]> {
  // Implementation would use Google Places API to find nearby alternatives
  // with lower risk factors
  return [];
}

async function analyzeTerritoryRisk(
  location: google.maps.LatLng,
  nearbyPlaces: google.maps.places.PlaceResult[],
  businessDescription: string
): Promise<{ rating: number; factors: string[] }> {
  const factors: string[] = [];
  let rating = 1.0;

  // Analyze business density
  const businessDensity = nearbyPlaces.length;
  if (businessDensity > 50) {
    rating *= 1.1;
    factors.push('High business density area');
  }

  // Check for hazardous neighbors
  const hazardousTypes = ['industrial', 'chemical', 'manufacturing'];
  const hasHazardousNeighbors = nearbyPlaces.some(place => 
    place.types?.some(type => hazardousTypes.includes(type))
  );
  
  if (hasHazardousNeighbors) {
    rating *= 1.15;
    factors.push('Proximity to hazardous businesses');
  }

  // Analyze business type compatibility
  const compatibleTypes = nearbyPlaces.filter(place =>
    place.types?.some(type => 
      businessDescription.toLowerCase().includes(type.replace(/_/g, ' '))
    )
  ).length;

  if (compatibleTypes > 5) {
    rating *= 0.95;
    factors.push('Strong business type compatibility');
  }

  return { rating, factors };
}