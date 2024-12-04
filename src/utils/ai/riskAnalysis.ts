import { BusinessInfo } from '../../types';
import { getOpenAIClient } from './config'; 
import { handleAIError, getFallbackRiskAnalysis } from './errorHandling';

export interface RiskFactor {
  category: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendations: string[];
}

export interface RiskAnalysis {
  overallRisk: 'low' | 'medium' | 'high';
  confidence: number;
  factors: RiskFactor[];
  summary: string;
  timestamp: string;
}

export async function analyzeBusinessRisk(data: BusinessInfo): Promise<RiskAnalysis> {
  try {
    const openai = await getOpenAIClient();
    if (!openai) {
      return getFallbackRiskAnalysis();
    }

    const prompt = `Analyze workers compensation risk factors for this business:
Business Type: ${data.entityType}
Description: ${data.description}
Years in Business: ${data.yearsInBusiness}
Employee Count: ${data.payrollInfo.reduce((sum, info) => sum + info.employeeCount, 0)}
Safety Programs: ${JSON.stringify(data.safetyPrograms)}
Loss History: ${JSON.stringify(data.lossHistory)}

Provide a detailed risk analysis including:
1. Overall risk level (low/medium/high)
2. Confidence score (0-1)
3. Key risk factors with severity and recommendations
4. Summary of findings

Format response as JSON with the following structure:
{
  "overallRisk": "low|medium|high",
  "confidence": 0.XX,
  "factors": [
    {
      "category": "string",
      "severity": "low|medium|high",
      "description": "string",
      "recommendations": ["string"]
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
    console.error('Risk analysis error:', aiError);
    return {
      ...getFallbackRiskAnalysis(),
      summary: aiError.message
    };
  }
}