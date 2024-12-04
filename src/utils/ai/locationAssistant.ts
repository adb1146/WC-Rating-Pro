import { OpenAI } from 'openai';
import { getOpenAIClient } from './config';
import { Address } from '../../types';

interface LocationSuggestion {
  address: Address;
  confidence: number;
  source?: string;
}

export async function suggestLocation(
  partialAddress: Partial<Address>
): Promise<LocationSuggestion[]> {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return [];
    }

    const prompt = `Given the partial address information, suggest a complete, valid US business address:
      Street: ${partialAddress.street1 || ''}
      City: ${partialAddress.city || ''}
      State: ${partialAddress.state || ''}
      ZIP: ${partialAddress.zipCode || ''}

    Requirements:
    - Return ONLY valid US addresses
    - Include complete street address, city, state, and ZIP
    - Format as JSON array of Address objects
    - Verify address components exist
    - Maximum 3 suggestions
    - No explanatory text`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    return (response.suggestions || []).map((suggestion: any) => ({
      address: {
        street1: suggestion.street1,
        street2: suggestion.street2 || '',
        city: suggestion.city,
        state: suggestion.state,
        zipCode: suggestion.zipCode
      },
      confidence: suggestion.confidence || 0.8
    }));
  } catch (error) {
    console.error('Error suggesting location:', error);
    return [];
  }
}

export async function validateAddress(address: Address): Promise<{
  isValid: boolean;
  suggestions?: Address[];
  errors?: string[];
}> {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return { isValid: false, errors: ['AI validation unavailable'] };
    }

    const prompt = `Validate this US business address and provide corrections if needed:
      ${address.street1}
      ${address.street2 ? address.street2 + '\n' : ''}
      ${address.city}, ${address.state} ${address.zipCode}

    Requirements:
    - Verify address format and components
    - Check ZIP code matches city/state
    - Return JSON with validation results
    - Include specific error messages if invalid
    - Suggest corrections if needed`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    return {
      isValid: response.isValid || false,
      suggestions: response.suggestions,
      errors: response.errors
    };
  } catch (error) {
    console.error('Error validating address:', error);
    return { isValid: false, errors: ['Validation error occurred'] };
  }
}