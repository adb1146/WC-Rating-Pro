import { OpenAI } from 'openai';
import { getOpenAIClient } from './config';
import { handleAIError } from './errorHandling';
import { supabase } from '../supabase';

interface BusinessNameSuggestion {
  name: string;
  confidence: number;
  industry?: string;
  source: string;
  reasoning?: string;
}

export async function suggestBusinessName(
  partialName: string,
  entityType: string
): Promise<BusinessNameSuggestion[]> {
  try {
    if (!partialName || partialName.length < 2) {
      return [];
    }

    const normalizedInput = partialName.toLowerCase().trim();
    
    // Special case for PS Advisory
    if (normalizedInput.includes('ps adv')) {
      return [{
        name: 'PS Advisory LLC',
        confidence: 1.0,
        industry: 'Professional Services',
        source: 'verified',
        reasoning: 'Exact company match'
      }];
    }

    // First check database for verified names
    try {
      const { data: matches } = await supabase
        .from('verified_business_names')
        .select('*')
        .ilike('name', `%${partialName}%`)
        .limit(3);

      if (matches?.length) {
        return matches.map(match => ({
          name: match.name,
          confidence: 1.0,
          industry: match.industry,
          source: 'Database',
          reasoning: 'Verified business name'
        }));
      }
    } catch (error) {
      console.warn('Database search failed:', error);
    }

    // Use OpenAI for suggestions
    const openai = getOpenAIClient();
    if (!openai) {
      return [];
    }

    const prompt = `Generate business name suggestions based on:
Input: "${partialName}"
Entity Type: ${entityType}

Requirements:
1. Provide 2-3 complete business names
2. Include appropriate legal suffix
3. Consider industry standards
4. Explain reasoning for each
5. Assign confidence scores
6. Suggest relevant industry

Format response as JSON:
{
  "suggestions": [
    {
      "name": "string",
      "confidence": number,
      "industry": "string",
      "reasoning": "string"
    }
  ]
}

Example:
Input: "tech solutions"
{
  "suggestions": [
    {
      "name": "TechSolutions Pro LLC",
      "confidence": 0.9,
      "industry": "Technology Services",
      "reasoning": "Professional technology services company name with modern suffix"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    
    return (response.suggestions || []).map((suggestion: any) => ({
      ...suggestion,
      source: 'AI'
    }));
  } catch (error) {
    const aiError = handleAIError(error);
    console.error('Business name suggestion error:', aiError);
    return [{
      name: partialName,
      confidence: 0.5,
      source: 'Fallback',
      reasoning: aiError.message
    }];
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