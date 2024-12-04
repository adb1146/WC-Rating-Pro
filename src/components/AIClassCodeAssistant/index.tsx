import React from 'react';
import { Brain, Lightbulb, Loader2 } from 'lucide-react';
import { getOpenAIClient } from '../../utils/ai/config';

interface AIClassCodeAssistantProps {
  stateCode: string;
  workDescription: string;
  onSuggestion: (suggestion: { classCode: string; description: string }) => void;
}

export function AIClassCodeAssistant({
  stateCode,
  workDescription,
  onSuggestion
}: AIClassCodeAssistantProps) {
  const [suggestions, setSuggestions] = React.useState<Array<{ classCode: string; description: string }>>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const generateSuggestions = async () => {
    if (!stateCode || !workDescription) return;

    setIsLoading(true);
    try {
      const openai = getOpenAIClient();
      if (!openai) {
        console.warn('OpenAI client not available');
        return;
      }

      const prompt = `Help classify this work description for workers compensation insurance:

State: ${stateCode}
Work Description: ${workDescription}

Common class codes include:
- 8810: Clerical Office Employees
- 8742: Outside Sales Personnel
- 8820: Attorneys
- 8832: Physicians & Clerical
- 8833: Hospitals
- 5183: Plumbing
- 5190: Electrical
- 3632: Machine Shop
- 7600: Telecommunications
- 9079: Restaurant

Requirements:
1. Suggest the most appropriate class code
2. Explain why it's the best match
3. Consider the nature of work and risk level
4. Focus on the primary operations
5. Consider state-specific requirements

Provide 2-3 suggestions in this format:
• Class Code XXXX - Description: [explanation]`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4-turbo-preview",
        temperature: 0.7,
        max_tokens: 500
      });

      const response = completion.choices[0].message.content;
      if (response) {
        const suggestions = response.split('\n')
          .filter(line => line.trim().startsWith('•'))
          .map(line => {
            const match = line.match(/Class Code (\d{4})(.*)/);
            if (match) {
              return {
                classCode: match[1],
                description: match[2].split('-')[1]?.trim() || ''
              };
            }
            return null;
          })
          .filter((s): s is { classCode: string; description: string } => s !== null);
        setSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error generating class code suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!stateCode) {
    return (
      <div className="mt-2 text-sm text-gray-500">
        Select a state to get AI suggestions for class codes
      </div>
    );
  }

  return (
    <div className="mt-2">
      <button
        onClick={generateSuggestions}
        disabled={isLoading || !workDescription}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing work description...
          </>
        ) : (
          <>
            <Brain className="w-4 h-4" />
            Get AI class code suggestions
          </>
        )}
      </button>

      {suggestions.length > 0 && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900">Suggested Class Codes:</h4>
              <ul className="mt-1 space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start justify-between gap-4 text-sm">
                    <div>
                      <span className="font-medium text-blue-700">{suggestion.classCode}</span>
                      <span className="text-blue-600"> - </span>
                      <span className="text-blue-700">{suggestion.description}</span>
                    </div>
                    <button
                      onClick={() => onSuggestion(suggestion)}
                      className="flex-shrink-0 text-xs text-blue-600 hover:text-blue-700"
                    >
                      Apply
                    </button>
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