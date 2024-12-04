import React from 'react';
import { HelpCircle, FileText, Quote, Brain, Shield, Lightbulb, Users, DollarSign, MapPin, AlertTriangle, Calendar, Target, Zap, LineChart, CheckCircle, Calculator, Save } from 'lucide-react';

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
            WC Rating Pro combines traditional underwriting expertise with advanced AI-powered insights to streamline your workers' compensation insurance application process. Our intelligent system provides real-time guidance, risk analysis, and premium optimization suggestions throughout your journey.
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
              <ul className="list-disc list-inside text-gray-600 space-y-3">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Real-time intelligent suggestions powered by GPT-4</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Automated class code recommendations with confidence scoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <LineChart className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Comprehensive risk assessment and benchmarking</span>
                </li>
                <li className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Data-driven premium optimization strategies</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Proactive Insights</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-3">
                <li className="flex items-start gap-2">
                  <Brain className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                  <span>AI-powered industry-specific risk analysis and guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                  <span>Customized safety program recommendations with ROI estimates</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                  <span>Predictive loss control analysis and mitigation strategies</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                  <span>Real-time compliance monitoring and assistance</span>
                </li>
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
              <ul className="list-disc list-inside text-gray-600 space-y-3">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Intelligent location validation and territory optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Brain className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>AI-assisted class code selection with confidence scoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <Calculator className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Advanced premium modeling and optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <LineChart className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Industry benchmarking and trend analysis</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Time-Saving Features</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-3">
                <li className="flex items-start gap-2">
                  <Save className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Intelligent auto-save and application versioning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Real-time validation with smart error detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Context-aware suggestions and auto-completion</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Visual progress tracking with completion estimates</span>
                </li>
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
            <div className="text-blue-700">
              <p className="mb-3">Our advanced AI assistant is available 24/7 throughout your application process. Look for the AI icon to access:</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Brain className="w-4 h-4 mt-1 text-blue-600" />
                  <span>Contextual help and smart suggestions</span>
                </div>
                <div className="flex items-start gap-2">
                  <LineChart className="w-4 h-4 mt-1 text-blue-600" />
                  <span>Real-time risk analysis and benchmarking</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-1 text-blue-600" />
                  <span>Safety program recommendations</span>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 mt-1 text-blue-600" />
                  <span>Premium optimization strategies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}