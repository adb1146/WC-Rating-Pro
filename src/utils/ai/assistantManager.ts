import { BusinessInfo } from '../../types';
import { getOpenAIClient, retryOpenAIRequest } from './config';
import { handleAIError } from './errorHandling';
import { suggestClassCodes } from './classCodeAssistant';
import { analyzeSafetyPrograms } from './safetyAnalysis';
import { analyzeBusinessRisk } from './riskAnalysis';
import { analyzePremiumOptimizations } from './premiumOptimization';

export interface AssistantResponse {
  suggestions: string[];
  confidence: number;
  context?: Record<string, any>;
}

export async function getContextualAssistance(
  section: string,
  data: BusinessInfo
): Promise<AssistantResponse> {
  try {
    const openai = await getOpenAIClient();
    if (!openai) {
      throw new Error('AI services unavailable');
    }

    const prompt = `Provide contextual assistance for the ${section} section of a workers compensation application:
Business Type: ${data.entityType}
Description: ${data.description}
Current Section: ${section}

Consider:
1. Industry-specific requirements
2. Common pitfalls to avoid
3. Best practices
4. Optimization opportunities

Format response as JSON with:
{
  "suggestions": ["string"],
  "confidence": number,
  "context": {}
}`;

    const completion = await retryOpenAIRequest(() => openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.3,
      response_format: { type: "json_object" }
    }));

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    const aiError = handleAIError(error);
    console.error('Contextual assistance error:', aiError);
    return {
      suggestions: [aiError.message],
      confidence: 0
    };
  }
}

export async function getSmartSuggestions(
  field: string,
  value: string,
  context: Record<string, any>
): Promise<AssistantResponse> {
  try {
    const openai = await getOpenAIClient();
    if (!openai) {
      throw new Error('AI services unavailable');
    }

    const prompt = `Provide smart suggestions for the ${field} field:
Current Value: ${value}
Context: ${JSON.stringify(context)}

Consider:
1. Field-specific validation rules
2. Industry best practices
3. Common patterns
4. Optimization opportunities

Format response as JSON with:
{
  "suggestions": ["string"],
  "confidence": number,
  "context": {}
}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    const aiError = handleAIError(error);
    console.error('Smart suggestions error:', aiError);
    return {
      suggestions: [aiError.message],
      confidence: 0
    };
  }
}

export async function getComprehensiveAnalysis(data: BusinessInfo) {
  try {
    const [
      riskAnalysis,
      safetyAnalysis,
      classCodeSuggestions,
      premiumOptimizations
    ] = await Promise.all([
      analyzeBusinessRisk(data),
      analyzeSafetyPrograms(data),
      suggestClassCodes(data.description, data.locations[0]?.state || ''),
      analyzePremiumOptimizations(data, 0, [])
    ]);

    return {
      riskAnalysis,
      safetyAnalysis,
      classCodeSuggestions,
      premiumOptimizations,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    const aiError = handleAIError(error);
    console.error('Comprehensive analysis error:', aiError);
    throw aiError;
  }
}