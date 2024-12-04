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
            WC Rating Pro combines traditional underwriting expertise with advanced AI-powered insights to deliver precise workers' compensation insurance ratings. Our system uses machine learning models, real-time data analysis, and predictive algorithms to provide accurate premium calculations while identifying optimization opportunities throughout the rating process.
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
                  <Brain className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Neural network-based risk scoring with 95% accuracy</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Machine learning loss prediction models</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>GPT-4 powered class code analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Real-time territory risk mapping</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Rating Process</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-3">
                <li className="flex items-start gap-2">
                  <Brain className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>AI-driven class code validation and rate verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <Calculator className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Multi-state experience rating with predictive modeling</span>
                </li>
                <li className="flex items-start gap-2">
                  <LineChart className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Dynamic schedule credit optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Territory-specific risk factor analysis</span>
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
            <h3 className="text-lg font-semibold text-blue-900 mb-2">AI-Powered Rating Process</h3>
            <div className="text-blue-700">
              <p className="mb-3">Our advanced AI system enhances the rating process through:</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Brain className="w-4 h-4 mt-1 text-blue-600" />
                  <span>Risk factor identification using machine learning models</span>
                </div>
                <div className="flex items-start gap-2">
                  <LineChart className="w-4 h-4 mt-1 text-blue-600" />
                  <span>Predictive analytics for loss development</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-1 text-blue-600" />
                  <span>Dynamic safety program effectiveness scoring</span>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 mt-1 text-blue-600" />
                  <span>Continuous premium optimization through real-time analysis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Advanced Rating System</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">1</div>
            <div>
              <h4 className="font-medium text-gray-900">Risk Assessment</h4>
              <p className="text-sm text-gray-600">Neural network analyzes 50+ risk factors including industry data, loss patterns, and safety metrics</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">2</div>
            <div>
              <h4 className="font-medium text-gray-900">Class Code Analysis</h4>
              <p className="text-sm text-gray-600">GPT-4 powered system validates classifications and suggests optimal codes based on operations</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">3</div>
            <div>
              <h4 className="font-medium text-gray-900">Experience Rating</h4>
              <p className="text-sm text-gray-600">Machine learning models analyze loss patterns and predict future claim likelihood</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">4</div>
            <div>
              <h4 className="font-medium text-gray-900">Credit Optimization</h4>
              <p className="text-sm text-gray-600">AI evaluates 200+ factors to maximize eligible credits and minimize premium</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">5</div>
            <div>
              <h4 className="font-medium text-gray-900">Premium Calculation</h4>
              <p className="text-sm text-gray-600">Final premium computed using territory-specific factors, credits, and modifiers</p>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Rating Factors Considered</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Primary Factors</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Class code base rates</li>
                <li>• Payroll by classification</li>
                <li>• Experience modification</li>
                <li>• Territory multipliers</li>
                <li>• Schedule credits/debits</li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Secondary Factors</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Safety program effectiveness</li>
                <li>• Claims frequency/severity</li>
                <li>• Industry loss trends</li>
                <li>• Operational risk controls</li>
                <li>• Workforce characteristics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Rating Capabilities</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Risk Analysis</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Brain className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                <span>Neural networks analyze 50+ risk indicators</span>
              </li>
              <li className="flex items-start gap-2">
                <Target className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                <span>Predictive modeling for loss development</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                <span>Real-time safety program effectiveness scoring</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Premium Optimization</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Calculator className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                <span>Dynamic credit eligibility analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <LineChart className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                <span>Territory-specific rate optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <DollarSign className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                <span>Continuous premium refinement</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}