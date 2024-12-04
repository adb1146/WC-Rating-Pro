import { BusinessInfo, RiskAssessmentResult } from '../../types';
import { getOpenAIClient } from './config';

export async function analyzeBusinessRisk(data: BusinessInfo): Promise<RiskAssessmentResult> {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return {
        riskLevel: 'medium',
        aiSuggestions: 'AI risk assessment is currently unavailable. Please configure your OpenAI API key.',
        timestamp: new Date().toISOString(),
        confidence: 0,
        factors: ['AI analysis unavailable'],
        recommendations: ['Configure OpenAI API key to enable AI features']
      };
    }

    const prompt = `Analyze workers compensation risk for the following business:
      Business Type: ${data.entityType}
      Years in Business: ${data.yearsInBusiness}
      Description: ${data.description}
      Employee Count: ${data.payrollInfo.reduce((sum, info) => sum + info.employeeCount, 0)}
      Safety Programs: ${data.safetyPrograms.length}
      Loss History: ${data.lossHistory.length} incidents
      
      Provide a risk assessment including:
      1. Overall risk level (low/medium/high)
      2. Key risk factors
      3. Recommended safety improvements
      4. Premium adjustment suggestions`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
    });

    const response = completion.choices[0].message.content;
    
    // Parse the AI response into structured data
    const riskLevel = response?.toLowerCase().includes('high risk') ? 'high' :
                     response?.toLowerCase().includes('medium risk') ? 'medium' : 'low';

    return {
      riskLevel,
      aiSuggestions: response || '',
      timestamp: new Date().toISOString(),
      confidence: 0.85, // Example confidence score
      factors: extractRiskFactors(response || ''),
      recommendations: extractRecommendations(response || '')
    };
  } catch (error) {
    console.error('AI Risk Assessment Error:', error);
    return {
      riskLevel: 'medium',
      aiSuggestions: 'Unable to perform AI analysis at this time.',
      timestamp: new Date().toISOString(),
      confidence: 0,
      factors: [],
      recommendations: []
    };
  }
}

function extractRiskFactors(aiResponse: string): string[] {
  const factors: string[] = [];
  const lines = aiResponse.split('\n');
  let inFactorsSection = false;

  for (const line of lines) {
    if (line.toLowerCase().includes('risk factor')) {
      inFactorsSection = true;
      continue;
    }
    if (inFactorsSection && line.trim().startsWith('-')) {
      factors.push(line.trim().substring(1).trim());
    }
    if (inFactorsSection && line.trim() === '') {
      inFactorsSection = false;
    }
  }

  return factors;
}

function extractRecommendations(aiResponse: string): string[] {
  const recommendations: string[] = [];
  const lines = aiResponse.split('\n');
  let inRecommendationsSection = false;

  for (const line of lines) {
    if (line.toLowerCase().includes('recommend')) {
      inRecommendationsSection = true;
      continue;
    }
    if (inRecommendationsSection && line.trim().startsWith('-')) {
      recommendations.push(line.trim().substring(1).trim());
    }
    if (inRecommendationsSection && line.trim() === '') {
      inRecommendationsSection = false;
    }
  }

  return recommendations;
}