import React from 'react';
import { HelpCircle, FileText, Quote, Brain, Shield, Lightbulb, Users, DollarSign, MapPin, AlertTriangle, Calendar } from 'lucide-react';

export function HelpTab() {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Welcome to WC Rating Pro</h2>
        </div>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-600">
            WC Rating Pro combines traditional underwriting expertise with AI-powered insights to streamline your workers' compensation insurance application process. Get accurate quotes faster with intelligent assistance every step of the way.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI-Powered Features</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Smart Assistance</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Real-time suggestions as you type</li>
                <li>Automated class code recommendations</li>
                <li>Risk assessment and optimization</li>
                <li>Premium saving opportunities</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Proactive Insights</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Industry-specific guidance</li>
                <li>Safety program recommendations</li>
                <li>Loss control suggestions</li>
                <li>Compliance assistance</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Application Process</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 mt-1 text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900">Business Information</h4>
                <p className="text-sm text-gray-600">Enter basic company details, entity type, and operations description</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-1 text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900">Locations</h4>
                <p className="text-sm text-gray-600">Add all business locations with address verification</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 mt-1 text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900">Safety & Risk</h4>
                <p className="text-sm text-gray-600">Document safety programs and risk control measures</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 mt-1 text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900">Loss History</h4>
                <p className="text-sm text-gray-600">Report prior claims and insurance information</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-4 h-4 mt-1 text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900">Premium Calculation</h4>
                <p className="text-sm text-gray-600">Review and optimize your premium quote</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Tips for Success</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Accurate Information</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Provide detailed business descriptions</li>
                <li>Keep payroll records up to date</li>
                <li>Document all safety measures</li>
                <li>Report complete loss history</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Premium Optimization</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Implement recommended safety programs</li>
                <li>Consider AI-suggested improvements</li>
                <li>Review class code accuracy</li>
                <li>Track safety program effectiveness</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Smart Tools</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Real-time address verification</li>
                <li>Automated class code lookup</li>
                <li>Territory rating optimization</li>
                <li>Experience mod calculation</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Time-Saving Features</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Save and resume applications</li>
                <li>Quick form validation</li>
                <li>Automated suggestions</li>
                <li>Progress tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <div className="flex items-start gap-4">
          <Brain className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Need More Help?</h3>
            <p className="text-blue-700">
              Our AI assistant is available throughout the application process. Look for the AI icon to get contextual help, suggestions, and optimization tips for each section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}