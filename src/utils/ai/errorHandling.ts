import { RiskAnalysis } from './riskAnalysis';
import { ClassCodeSuggestion } from './classCodeAssistant';
import { SafetyAnalysis } from './safetyAnalysis';
import { PremiumOptimization } from './premiumOptimization';
import { Address } from '../../types';

export interface AIError {
  code: string;
  message: string;
  suggestion?: string;
}

export const AI_ERROR_CODES = {
  NOT_INITIALIZED: 'AI_NOT_INITIALIZED',
  API_ERROR: 'AI_API_ERROR',
  RATE_LIMIT: 'AI_RATE_LIMIT',
  CONTEXT_ERROR: 'AI_CONTEXT_ERROR',
  VALIDATION_ERROR: 'AI_VALIDATION_ERROR'
} as const;

export function handleAIError(error: unknown): AIError {
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('API key')) {
      return {
        code: AI_ERROR_CODES.NOT_INITIALIZED,
        message: 'AI services are currently unavailable',
        suggestion: 'Please try again later or contact support'
      };
    }
    
    if (error.message.includes('rate limit')) {
      return {
        code: AI_ERROR_CODES.RATE_LIMIT,
        message: 'Too many requests',
        suggestion: 'Please wait a moment and try again'
      };
    }
    
    if (error.message.includes('context')) {
      return {
        code: AI_ERROR_CODES.CONTEXT_ERROR,
        message: 'Unable to analyze context',
        suggestion: 'Please provide more information'
      };
    }
    
    if (error.message.includes('validation')) {
      return {
        code: AI_ERROR_CODES.VALIDATION_ERROR,
        message: 'Invalid input data',
        suggestion: 'Please check your input and try again'
      };
    }
    
    return {
      code: AI_ERROR_CODES.API_ERROR,
      message: error.message || 'An error occurred while processing your request',
      suggestion: 'Please try again or use manual entry'
    };
  }
  
  return {
    code: AI_ERROR_CODES.API_ERROR,
    message: 'An unexpected error occurred',
    suggestion: 'Please try again later'
  };
}

export function getFallbackRiskAnalysis(): RiskAnalysis {
  return {
    overallRisk: 'medium',
    confidence: 0,
    factors: [],
    summary: 'Unable to perform AI risk analysis. Using default risk assessment.',
    timestamp: new Date().toISOString()
  };
}

export function getFallbackClassCodeSuggestion(): ClassCodeSuggestion {
  return {
    classCode: '8810',
    description: 'Clerical Office Employees',
    confidence: 0,
    reasoning: 'Default suggestion - please verify manually',
  };
}

export function getFallbackSafetyAnalysis(): SafetyAnalysis {
  return {
    existingProgramsAssessment: [],
    recommendations: [],
    industryBenchmarks: [],
    summary: 'Unable to perform AI safety analysis. Please review safety programs manually.',
    timestamp: new Date().toISOString()
  };
}

export function getFallbackPremiumOptimization(): PremiumOptimization {
  return {
    suggestions: [],
    totalPotentialSavings: 0,
    prioritizedActions: [],
    timestamp: new Date().toISOString()
  };
}

export function getFallbackLocationSuggestions() {
  return [{
    address: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zipCode: ''
    },
    confidence: 0,
    businessPresence: false,
    nearbyBusinesses: [],
    riskFactors: ['Unable to analyze location']
  }];
}