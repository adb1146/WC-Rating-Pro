import React from 'react';
import { Brain, Lightbulb, X } from 'lucide-react';
import { useTutorial } from '../TutorialContext';

interface SectionTutorialProps {
  section: string;
  title: string;
  description: string;
  tips: string[];
  aiFeatures: string[];
}

export function SectionTutorial({ section, title, description, tips, aiFeatures }: SectionTutorialProps) {
  const { showTutorial, setShowTutorial } = useTutorial();
  const [isVisible, setIsVisible] = React.useState(true);

  if (!showTutorial || !isVisible) return null;

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50 to-white p-6 rounded-lg border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-gray-600 mb-4">{description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            Tips for This Section
          </h4>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-600" />
            AI Assistance Available
          </h4>
          <ul className="space-y-2">
            {aiFeatures.map((feature, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-blue-100">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              localStorage.setItem('tutorialSeen', 'true');
              setShowTutorial(false);
            }}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Don't show tutorials again
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}