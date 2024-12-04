import React from 'react';
import { Brain, AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';
import { RiskAssessmentResult, PremiumSuggestion } from '../../types/ai';
import { formatCurrency } from '../../utils/formatters';

interface AIRiskInsightsProps {
  riskAssessment: RiskAssessmentResult;
  premiumSuggestions: PremiumSuggestion[];
}

export function AIRiskInsights({ riskAssessment, premiumSuggestions }: AIRiskInsightsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI Risk Insights</h2>
        </div>
        <div className="ml-auto flex items-center gap-1 text-sm text-blue-600">
          <Shield className="w-4 h-4" />
          <span>AI-powered analysis</span>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          Our AI has analyzed your business data to provide personalized insights and recommendations. 
          These insights are based on industry trends, historical data, and advanced risk modeling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <h3 className="text-lg font-medium text-gray-900">Risk Assessment</h3>
          </div>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${riskAssessment.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
              riskAssessment.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'}`}>
            {riskAssessment.riskLevel.toUpperCase()} RISK
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Key Risk Factors:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {riskAssessment.factors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Recommendations:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {riskAssessment.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-900">Premium Analysis</h3>
          </div>

          <div className="space-y-4">
            {premiumSuggestions.map((suggestion, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-medium text-gray-900">
                    {formatCurrency(suggestion.premium)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {(suggestion.confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{suggestion.reasoning}</p>
                {suggestion.adjustments.length > 0 && (
                  <div className="space-y-1">
                    <h5 className="text-sm font-medium text-gray-700">Suggested Adjustments:</h5>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {suggestion.adjustments.map((adjustment, idx) => (
                        <li key={idx}>{adjustment}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ShieldCheck className="w-4 h-4" />
          AI analysis last updated: {new Date(riskAssessment.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}