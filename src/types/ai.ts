export interface RiskAssessmentResult {
  riskLevel: 'low' | 'medium' | 'high';
  aiSuggestions: string;
  timestamp: string;
  confidence: number;
  factors: string[];
  recommendations: string[];
}

export interface PremiumSuggestion {
  premium: number;
  confidence: number;
  adjustments: string[];
  reasoning: string;
}

export interface AIAnalysis {
  riskAssessment: RiskAssessmentResult;
  premiumSuggestions: PremiumSuggestion[];
  timestamp: string;
}