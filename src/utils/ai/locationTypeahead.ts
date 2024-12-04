import { Address } from '../../types';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface PlaceDetails {
  address_components: google.maps.GeocoderAddressComponent[];
  formatted_address: string;
  place_id: string;
}

export async function getAddressSuggestions(
  input: string,
  state?: string
): Promise<Address[]> {
  if (!input || input.length < 5 || !window.google) {
    return [];
  }

  try {
    const service = new google.maps.places.AutocompleteService();
    const sessionToken = new google.maps.places.AutocompleteSessionToken();

    const request = {
      input,
      sessionToken,
      componentRestrictions: { country: 'us' },
      types: ['address'],
    };

    if (state) {
      request.componentRestrictions['administrativeArea'] = state;
    }

    const predictions = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve, reject) => {
      service.getPlacePredictions(
        request,
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            reject(status);
          }
        }
      );
    });

    const placesService = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    const addresses = await Promise.all(
      predictions.map(async (prediction) => {
        const details = await new Promise<PlaceDetails>((resolve, reject) => {
          placesService.getDetails(
            {
              placeId: prediction.place_id,
              fields: ['address_components', 'formatted_address']
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

        const address: Address = {
          street1: '',
          street2: '',
          city: '',
          state: '',
          zipCode: ''
        };

        details.address_components.forEach(component => {
          const type = component.types[0];
          switch (type) {
            case 'street_number':
              address.street1 = component.long_name;
              break;
            case 'route':
              address.street1 += ' ' + component.long_name;
              break;
            case 'subpremise':
              address.street2 = 'Suite ' + component.long_name;
              break;
            case 'locality':
              address.city = component.long_name;
              break;
            case 'administrative_area_level_1':
              address.state = component.short_name;
              break;
            case 'postal_code':
              address.zipCode = component.long_name;
              break;
          }
        });

        return address;
      })
    );

    return addresses;
  } catch (error) {
    console.error('Error getting address suggestions:', error);
    return [];
  }
}

export function formatAddress(address: Partial<Address>): string {
  const parts = [];
  
  if (address.street1) {
    parts.push(address.street1);
  }
  
  if (address.street2) {
    parts.push(address.street2);
  }
  
  if (address.city && address.state) {
    parts.push(`${address.city}, ${address.state}`);
  }
  
  if (address.zipCode) {
    parts.push(address.zipCode);
  }

  return parts.join(' ');
}