import React from 'react';
import { Brain, Lightbulb, Shield, Target, X } from 'lucide-react';

interface AITutorialProps {
  onClose: () => void;
}

export function AITutorial({ onClose }: AITutorialProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI-Powered Application Assistant</h2>
          <button
            onClick={() => {
              localStorage.removeItem('tutorialSeen');
              window.location.reload();
            }}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Brain className="w-4 h-4" />
            Reset Tutorial
          </button>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="prose prose-blue max-w-none">
        <p className="text-gray-600">
          Welcome! Our AI assistant will help you complete your workers' compensation application
          efficiently and accurately. Here's how it works:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-medium text-blue-900 m-0">Real-time Assistance</h3>
            </div>
            <ul className="mt-2 space-y-2 list-none pl-0">
              <li className="flex items-start gap-2 text-sm text-blue-700">
                <span className="text-blue-400 mt-1">•</span>
                Smart suggestions as you type
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-700">
                <span className="text-blue-400 mt-1">•</span>
                Industry-specific guidance
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-700">
                <span className="text-blue-400 mt-1">•</span>
                Data validation and error prevention
              </li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-medium text-green-900 m-0">Risk Analysis</h3>
            </div>
            <ul className="mt-2 space-y-2 list-none pl-0">
              <li className="flex items-start gap-2 text-sm text-green-700">
                <span className="text-green-400 mt-1">•</span>
                Automated risk assessment
              </li>
              <li className="flex items-start gap-2 text-sm text-green-700">
                <span className="text-green-400 mt-1">•</span>
                Safety program recommendations
              </li>
              <li className="flex items-start gap-2 text-sm text-green-700">
                <span className="text-green-400 mt-1">•</span>
                Premium optimization tips
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900 m-0">Getting Started</h3>
          </div>
          <ol className="mt-2 space-y-2 list-decimal pl-4 mb-0">
            <li className="text-sm text-gray-600">
              Look for the AI indicator <Brain className="w-4 h-4 text-blue-600 inline" /> throughout the form
            </li>
            <li className="text-sm text-gray-600">
              Click suggestions to automatically apply them
            </li>
            <li className="text-sm text-gray-600">
              Use the draggable AI assistant for contextual help
            </li>
            <li className="text-sm text-gray-600">
              Review AI-powered risk insights before submission
            </li>
          </ol>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lightbulb className="w-4 h-4" />
            <span>AI continuously learns from your interactions</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}