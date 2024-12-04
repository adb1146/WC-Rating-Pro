import { getOpenAIClient } from './config';
import { handleAIError, getFallbackClassCodeSuggestion } from './errorHandling';

export interface ClassCodeSuggestion {
  classCode: string;
  description: string;
  confidence: number;
  reasoning: string;
  alternativeCodes?: {
    code: string;
    description: string;
    reason: string;
  }[];
}

export async function suggestClassCodes(
  businessDescription: string,
  stateCode: string
): Promise<ClassCodeSuggestion[]> {
  const openai = await getOpenAIClient();
  if (!openai) {
    return [getFallbackClassCodeSuggestion()];
  }

  const prompt = `Suggest workers compensation class codes for:
State: ${stateCode}
Business Description: ${businessDescription}

Common class codes include:
- 8810: Clerical Office Employees
- 8742: Outside Sales Personnel
- 8820: Attorneys
- 8832: Physicians & Clerical
- 8833: Hospitals
- 5183: Plumbing
- 5190: Electrical
- 3632: Machine Shop
- 7600: Telecommunications
- 9079: Restaurant

Provide class code suggestions with:
1. Primary recommended code
2. Confidence level
3. Detailed reasoning
4. Alternative options if applicable

Format response as JSON with the following structure:
{
  "suggestions": [
    {
      "classCode": "string",
      "description": "string",
      "confidence": number,
      "reasoning": "string",
      "alternativeCodes": [
        {
          "code": "string",
          "description": "string",
          "reason": "string"
        }
      ]
    }
  ]
}`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    return response.suggestions || [];
  } catch (error) {
    const aiError = handleAIError(error);
    console.error('Class code suggestion error:', aiError);
    return [{
      ...getFallbackClassCodeSuggestion(),
      reasoning: aiError.message
    }];
  }
}