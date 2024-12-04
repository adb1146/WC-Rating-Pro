import React from 'react';
import { Brain, FileText, Quote, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface HomeTutorialProps {
  onClose: () => void;
}

export function HomeTutorial({ onClose }: HomeTutorialProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Welcome to Your Insurance Dashboard</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <AlertCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-medium text-blue-900 m-0">Managing Applications</h3>
          </div>
          <ul className="space-y-3 list-none pl-0">
            <li className="flex items-start gap-2 text-sm text-blue-700">
              <Clock className="w-4 h-4 mt-0.5 text-blue-500" />
              <span>Track application status and progress</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-blue-700">
              <CheckCircle className="w-4 h-4 mt-0.5 text-blue-500" />
              <span>Review and update saved applications</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-blue-700">
              <Brain className="w-4 h-4 mt-0.5 text-blue-500" />
              <span>Get AI-powered optimization suggestions</span>
            </li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Quote className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-medium text-green-900 m-0">Quote Management</h3>
          </div>
          <ul className="space-y-3 list-none pl-0">
            <li className="flex items-start gap-2 text-sm text-green-700">
              <Clock className="w-4 h-4 mt-0.5 text-green-500" />
              <span>Monitor quote status and expiration</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-green-700">
              <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
              <span>Generate new quotes from applications</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-green-700">
              <Brain className="w-4 h-4 mt-0.5 text-green-500" />
              <span>Receive AI suggestions for quote optimization</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Quick Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Applications</h5>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Click "New Rating" to start a new application
              </li>
              <li className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Use AI assistance for accurate completion
              </li>
              <li className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Save progress at any time
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Quotes</h5>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Review quotes before issuing
              </li>
              <li className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Track status changes
              </li>
              <li className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Monitor expiration dates
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Brain className="w-4 h-4" />
          <span>AI assistance available throughout</span>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}