import React from 'react';
import { Brain, Lightbulb, Loader2, MessageCircle } from 'lucide-react';
import { getFieldSuggestions } from '../../utils/ai/formAssistant';
import { BusinessInfo } from '../../types';

interface AIFieldAssistantProps {
  field: string;
  value: string;
  businessInfo: BusinessInfo;
  onSuggestion: (suggestion: string) => void;
}

export function AIFieldAssistant({ field, value, businessInfo, onSuggestion }: AIFieldAssistantProps) {
  const [suggestion, setSuggestion] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showHelp, setShowHelp] = React.useState(false);

  const getHelpText = () => {
    switch (field) {
      case 'businessName':
        return 'Enter your company\'s legal business name. Click "Ask AI" for assistance or verification.';
      default:
        return 'Need help? Click "Ask AI" for assistance.';
    }
  };

  React.useEffect(() => {
    // Clear previous suggestions when value changes
    setSuggestion('');
    setShowHelp(false);
  }, [value]);


  const handleAskAI = async () => {
    setIsLoading(true);
    try {
      const aiSuggestion = await getFieldSuggestions(field, value, businessInfo);
      setSuggestion(aiSuggestion);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <MessageCircle className="w-4 h-4" />
          Need help?
        </button>
        <button
          onClick={handleAskAI}
          disabled={isLoading}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Brain className="w-4 h-4" />
          )}
          Ask AI
        </button>
      </div>
      
      {showHelp && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">{getHelpText()}</p>
        </div>
      )}

      {suggestion && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">AI Suggestion:</span>
                <button
                  onClick={() => onSuggestion(suggestion)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Apply
                </button>
              </div>
              <p className="mt-1 text-sm text-blue-700">{suggestion}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}