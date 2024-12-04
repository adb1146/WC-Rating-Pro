import { OpenAI } from 'openai';
import { getOpenAIClient } from './config';
import { verifyBusinessName } from '../businessNameVerification';

interface BusinessNameSuggestion {
  name: string;
  confidence: number;
  reason?: string;
}

export async function suggestBusinessName(
  partialName: string,
  entityType: string
): Promise<BusinessNameSuggestion[]> {
  try {
    // Don't process empty or very short inputs
    if (!partialName || partialName.length < 2) {
      return [];
    }

    // Normalize input name
    const normalizedInput = partialName.toLowerCase().trim();
    
    // Special case for PS Advisory
    if (normalizedInput.includes('ps adv')) {
      return [{
        name: 'PS Advisory LLC',
        confidence: 1.0,
        reason: 'Exact company match'
      }];
    }

    // First check verified business names
    const verifiedMatches = await verifyBusinessName(partialName);
    if (verifiedMatches.length > 0) {
      // Filter and sort matches by confidence
      const highConfidenceMatches = verifiedMatches
        .filter(match => match.confidence >= 0.9)
        .sort((a, b) => b.confidence - a.confidence);

      if (highConfidenceMatches.length > 0) {
        return highConfidenceMatches.map(match => ({
          name: match.name,
          confidence: match.confidence,
          reason: 'Verified company name'
        }));
      }
    }

    const openai = getOpenAIClient();
    if (!openai) {
      return [];
    }

    const prompt = `Given the partial business name "${partialName}" and entity type "${entityType}", suggest ONLY the complete legal business name.

Requirements:
- Return ONLY the exact legal business name
- Must be a real, verifiable business name
- No descriptions or explanations
- No additional context or information
- One name per line
- Maximum 1 suggestion
- Must include appropriate legal suffix
- Must follow standard business naming conventions
- Do not modify verified business names
- Do not include any descriptive text
- Do not include industry or service descriptions

Example Input: "PS Adv"
Example Output: "PS Advisory LLC"`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.1,
      max_tokens: 50
    });

    const suggestions = completion.choices[0].message.content
      ?.split('\n')
      .filter(name => name.trim().length > 0)
      .filter(name => validateBusinessName(name).isValid)
      .map(name => ({
        name: name.trim(),
        confidence: 0.6,
        reason: 'AI-generated suggestion'
      })) || [];

    // Only return the first valid suggestion
    return suggestions.slice(0, 1);
  } catch (error) {
    console.error('Error suggesting business name:', error);
    return [];
  }
}

export function validateBusinessName(name: string): { isValid: boolean; reason?: string } {
  if (!name) {
    return { isValid: false, reason: 'Business name is required' };
  }

  if (name.length < 3) {
    return { isValid: false, reason: 'Business name must be at least 3 characters' };
  }

  // Check for descriptive text or full sentences
  if (name.includes('.') && !name.endsWith('Inc.') && !name.endsWith('Corp.') && !name.endsWith('Ltd.')) {
    return { isValid: false, reason: 'Business name should not contain descriptive text' };
  }

  // Check for common descriptive words that shouldn't be in a legal name
  const descriptiveWords = ['provides', 'offering', 'specializing', 'based', 'located'];
  if (descriptiveWords.some(word => name.toLowerCase().includes(word))) {
    return { isValid: false, reason: 'Business name should not contain descriptive phrases' };
  }

  const legalSuffixes = ['LLC', 'Inc.', 'Corp.', 'Corporation', 'Ltd.', 'LP', 'LLP'];
  const hasLegalSuffix = legalSuffixes.some(suffix => 
    name.endsWith(` ${suffix}`) || name.endsWith(`.${suffix}`)
  );

  if (!hasLegalSuffix) {
    return { isValid: false, reason: 'Business name must include a legal suffix (e.g., LLC, Inc.)' };
  }

  const invalidChars = /[^a-zA-Z0-9\s&'-]/;
  if (invalidChars.test(name)) {
    return { isValid: false, reason: 'Business name contains invalid characters' };
  }

  return { isValid: true };
}