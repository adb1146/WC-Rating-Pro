import React from 'react';
import { Brain, Lightbulb, AlertCircle } from 'lucide-react';
import { getFieldSuggestions, validateBusinessDescription, getIndustrySpecificGuidance } from '../../utils/ai/formAssistant';
import { BusinessInfo } from '../../types';

interface AIAssistantProps {
  field: string;
  value: string;
  businessInfo: BusinessInfo;
  onSuggestion?: (suggestion: string) => void;
}

export function AIAssistant({ field, value, businessInfo, onSuggestion }: AIAssistantProps) {
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const getSuggestions = React.useCallback(async () => {
    setIsLoading(true);
    try {
      if (field === 'businessDescription') {
        const { suggestions } = await validateBusinessDescription(value);
        setSuggestions(suggestions);
      } else {
        const suggestion = await getFieldSuggestions(field, value, businessInfo);
        setSuggestions(suggestion ? [suggestion] : []);
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
    }
    setIsLoading(false);
  }, [field, value, businessInfo]);

  return (
    <div className="mt-2">
      <button
        onClick={getSuggestions}
        disabled={isLoading}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
      >
        <Brain className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
        {isLoading ? 'Getting AI suggestions...' : 'Get AI suggestions'}
      </button>

      {suggestions.length > 0 && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900">AI Suggestions:</h4>
              <ul className="mt-1 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}