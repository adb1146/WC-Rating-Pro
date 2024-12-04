import React from 'react';
import { Brain, Lightbulb, Loader2 } from 'lucide-react';
import { getOpenAIClient } from '../../utils/ai/config';

interface AIDescriptionAssistantProps {
  field: string;
  value: string;
  context?: Record<string, any>;
  placeholder?: string;
  onSuggestion: (suggestion: string) => void;
}

export function AIDescriptionAssistant({
  field,
  value,
  context = {},
  placeholder,
  onSuggestion
}: AIDescriptionAssistantProps) {
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      const openai = getOpenAIClient();
      if (!openai) {
        console.warn('OpenAI client not available');
        return;
      }

      const prompt = `Help improve this ${field} description for a workers compensation insurance application:

Current Description: ${value || 'None provided'}
${Object.entries(context).map(([key, val]) => `${key}: ${val}`).join('\n')}

Field-Specific Guidelines:
${field === 'business' ? `
- Focus on primary business operations and activities
- Highlight employee roles and responsibilities
- Mention key safety measures and controls
- Include relevant industry certifications` : field === 'safety program' ? `
- Describe program objectives and scope
- Include training and implementation details
- Specify compliance standards met
- Outline monitoring and evaluation methods` : field === 'risk control measures' ? `
- Detail specific hazard mitigation steps
- Include equipment and procedures used
- Specify frequency of inspections/reviews
- Note employee training requirements` : field === 'loss incident' ? `
- Describe incident circumstances clearly
- Include immediate actions taken
- Note preventive measures implemented
- Specify any policy/procedure changes`
: ''}

Provide 2 concise, industry-standard descriptions ready for direct use.
Each suggestion should be complete and start with a bullet point (•).`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4-turbo-preview",
        temperature: 0.7,
        max_tokens: 300
      });

      const response = completion.choices[0].message.content;
      if (response) {
        const suggestions = response.split('\n')
          .filter(line => line.trim().startsWith('•'))
          .map(line => line.trim().substring(1).trim());
        setSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={generateSuggestions}
        disabled={isLoading}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing and generating suggestions...</span>
          </>
        ) : (
          <>
            <Brain className="w-4 h-4" />
            Get contextual suggestions
          </>
        )}
      </button>

      {suggestions.length > 0 && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <ul className="mt-1 space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start justify-between gap-4 text-sm border-b border-blue-100 pb-2 last:border-0">
                    <div className="flex-1">
                      <p className="text-blue-700 whitespace-pre-wrap">{suggestion}</p>
                    </div>
                    <button
                      onClick={() => onSuggestion(suggestion)}
                      className="flex-shrink-0 text-xs text-blue-600 hover:text-blue-700 whitespace-nowrap px-2 py-1 bg-white/50 rounded hover:bg-white/75 transition-colors"
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