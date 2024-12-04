import { BusinessInfo, SafetyProgram } from '../../types';
import { getOpenAIClient } from './config';
import { handleAIError, getFallbackSafetyAnalysis } from './errorHandling';

export interface SafetyRecommendation {
  program: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  implementation: string;
  estimatedCost: 'low' | 'medium' | 'high';
  potentialImpact: string;
}

export interface SafetyAnalysis {
  existingProgramsAssessment: {
    program: string;
    effectiveness: number;
    improvements: string[];
  }[];
  recommendations: SafetyRecommendation[];
  industryBenchmarks: {
    metric: string;
    businessValue: number;
    industryAverage: number;
    percentile: number;
  }[];
  summary: string;
  timestamp: string;
}

export async function analyzeSafetyPrograms(
  data: BusinessInfo
): Promise<SafetyAnalysis> {
  try {
    const openai = await getOpenAIClient();
    if (!openai) {
      throw new Error('AI services unavailable');
    }

    const prompt = `Analyze workers compensation safety programs for:
Business Type: ${data.entityType}
Description: ${data.description}
Current Programs: ${JSON.stringify(data.safetyPrograms)}
Loss History: ${JSON.stringify(data.lossHistory)}
Risk Controls: ${JSON.stringify(data.riskControls)}

Provide comprehensive safety analysis including:
1. Assessment of existing programs
2. Recommendations for new programs
3. Industry benchmarking
4. Implementation guidance

Format response as JSON with the following structure:
{
  "existingProgramsAssessment": [
    {
      "program": "string",
      "effectiveness": number,
      "improvements": ["string"]
    }
  ],
  "recommendations": [
    {
      "program": "string",
      "description": "string",
      "priority": "high|medium|low",
      "implementation": "string",
      "estimatedCost": "low|medium|high",
      "potentialImpact": "string"
    }
  ],
  "industryBenchmarks": [
    {
      "metric": "string",
      "businessValue": number,
      "industryAverage": number,
      "percentile": number
    }
  ],
  "summary": "string"
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
    console.error('Safety analysis error:', aiError);
    return getFallbackSafetyAnalysis();
  }
}