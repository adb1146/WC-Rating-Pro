import { BusinessInfo, PremiumBreakdown } from '../../types';
import { getOpenAIClient } from './config';
import { handleAIError, getFallbackPremiumOptimization } from './errorHandling';

export interface OptimizationSuggestion {
  type: 'credit' | 'modification' | 'program';
  description: string;
  potentialSavings: number;
  implementation: string;
  timeframe: 'immediate' | 'short-term' | 'long-term';
  confidence: number;
}

export interface PremiumOptimization {
  suggestions: OptimizationSuggestion[];
  totalPotentialSavings: number;
  prioritizedActions: string[];
  timestamp: string;
}

export async function analyzePremiumOptimizations(
  data: BusinessInfo,
  currentPremium: number,
  breakdowns: PremiumBreakdown[]
): Promise<PremiumOptimization> {
  try {
    const openai = await getOpenAIClient();
    if (!openai) {
      return getFallbackPremiumOptimization();
    }

    const prompt = `Analyze workers compensation premium optimization opportunities:
Current Premium: ${currentPremium}
Premium Breakdowns: ${JSON.stringify(breakdowns)}
Safety Programs: ${JSON.stringify(data.safetyPrograms)}
Risk Controls: ${JSON.stringify(data.riskControls)}
Loss History: ${JSON.stringify(data.lossHistory)}

Identify opportunities for premium reduction through:
1. Safety program improvements
2. Risk control enhancements
3. Experience modification optimization
4. Schedule credit qualification
5. Classification optimization

Format response as JSON with the following structure:
{
  "suggestions": [
    {
      "type": "credit|modification|program",
      "description": "string",
      "potentialSavings": number,
      "implementation": "string",
      "timeframe": "immediate|short-term|long-term",
      "confidence": number
    }
  ],
  "totalPotentialSavings": number,
  "prioritizedActions": ["string"]
}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    
    return {
      ...response,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    const aiError = handleAIError(error);
    console.error('Premium optimization error:', aiError);
    return {
      ...getFallbackPremiumOptimization(),
      prioritizedActions: [aiError.message]
    };
  }
}