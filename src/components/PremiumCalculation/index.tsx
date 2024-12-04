import React from 'react';
import { Calculator, DollarSign, Loader2, AlertCircle, Brain } from 'lucide-react';
import { BusinessInfo, PremiumBreakdown } from '../../types';
import { SupplementalCoverageForm } from '../SupplementalCoverageForm';
import { RiskAssessmentResult, PremiumSuggestion } from '../../types/ai';
import { calculateStatePremium, calculateTotalPremium } from '../../utils/premium';
import { formatCurrency } from '../../utils/formatters';
import { PremiumCalculationDetails } from '../PremiumCalculationDetails';
import { PremiumConfirmationDialog } from '../PremiumConfirmationDialog';
import { AIRiskInsights } from '../AIRiskInsights';
import { validateBusinessInfo } from '../../utils/validation';
import { analyzeBusinessRisk } from '../../utils/ai/riskAssessment';
import { generatePremiumSuggestions } from '../../utils/ai/premiumSuggestions';

interface PremiumCalculationProps {
  data: BusinessInfo;
  onChange: (data: BusinessInfo) => void;
  onSave: (premium: number) => void;
}

export function PremiumCalculation({ data, onChange, onSave }: PremiumCalculationProps) {
  const [isCalculating, setIsCalculating] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [calculatedPremiums, setCalculatedPremiums] = React.useState<PremiumBreakdown[]>([]);
  const [riskAssessment, setRiskAssessment] = React.useState<RiskAssessmentResult>();
  const [premiumSuggestions, setPremiumSuggestions] = React.useState<PremiumSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const { isValid, errors } = validateBusinessInfo(data);
  const totalPremium = calculateTotalPremium(calculatedPremiums);
  const states = [...new Set(calculatedPremiums.map((premium) => premium.stateCode))];

  const handleModifierChange = (field: keyof BusinessInfo['modifiers'], value: number) => {
    onChange({
      ...data,
      modifiers: {
        ...data.modifiers,
        [field]: value,
      },
    });
  };

  const handleCalculatePremium = () => {
    setShowConfirmation(true);
  };

  const handleConfirmCalculation = async () => {
    setShowConfirmation(false);
    setIsCalculating(true);
    setIsAnalyzing(true);

    try {
      const states = [...new Set(data.payrollInfo.map((info) => info.stateCode))].filter(Boolean);
      const premiums = await Promise.all(
        states.map(async (stateCode) =>
          calculateStatePremium(data.payrollInfo, data.modifiers, stateCode)
        )
      );
      setCalculatedPremiums(premiums.flat());
      setIsCalculating(false);
      
      // Perform AI analysis
      Promise.all([
        analyzeBusinessRisk(data),
        generatePremiumSuggestions(data)
      ]).then(([assessment, suggestions]) => {
        setRiskAssessment(assessment);
        setPremiumSuggestions(suggestions);
      }).finally(() => {
        setIsAnalyzing(false);
      });
    } catch (error) {
      console.error('Error calculating premium:', error);
      setIsCalculating(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Premium Calculation</h2>
      </div>
      {!isValid && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Please complete all required fields before calculating premium</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Experience Modification Factor
          </label>
          <input
            type="number"
            value={data.modifiers.experienceMod || ''}
            onChange={(e) => handleModifierChange('experienceMod', parseFloat(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
            min="0.75"
            max="2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Schedule Credit/Debit
          </label>
          <input
            type="number"
            value={data.modifiers.scheduleCredit || ''}
            onChange={(e) => handleModifierChange('scheduleCredit', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
            min="-0.25"
            max="0.25"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Safety Credit
          </label>
          <input
            type="number"
            value={data.modifiers.safetyCredit || ''}
            onChange={(e) => handleModifierChange('safetyCredit', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
            min="0"
            max="0.15"
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">AI-Powered Premium Calculation</h3>
              <p className="text-sm text-blue-700">Our AI will analyze your business data to provide risk insights and premium recommendations</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCalculatePremium}
          disabled={!isValid || isCalculating}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-semibold rounded-md shadow-sm
            ${isValid && !isCalculating
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          {isCalculating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Calculating Premium...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4" />
              Calculate Premium
            </>
          )}
        </button>
      </div>

      {calculatedPremiums.length > 0 ? (
        <div className="space-y-6">
          {states.map((stateCode) => {
            const stateBreakdowns = calculatedPremiums.filter(
              (breakdown) => breakdown.stateCode === stateCode
            );
            const statePremium = calculateTotalPremium(stateBreakdowns);

            return (
              <div key={stateCode} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {stateCode} Premium Breakdown
                </h3>
                <div className="space-y-4">
                  {stateBreakdowns.map((breakdown, index) => {
                    return (
                      <div key={`${breakdown.stateCode}-${breakdown.classCode}-${index}`}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Class Code:</span>
                            <br />
                            {breakdown.classCode}
                          </div>
                          <div>
                            <span className="text-gray-500">Payroll:</span>
                            <br />
                            {formatCurrency(breakdown.payroll)}
                          </div>
                          <div>
                            <span className="text-gray-500">Base Rate:</span>
                            <br />
                            {breakdown.baseRate.toFixed(2)}
                          </div>
                          <div>
                            <span className="text-gray-500">Premium:</span>
                            <br />
                            {formatCurrency(breakdown.finalPremium)}
                          </div>
                        </div>
                        <div className="mt-2">
                          <PremiumCalculationDetails
                            breakdown={breakdown}
                            modifiers={data.modifiers}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-right font-medium">
                      State Total: {formatCurrency(statePremium)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Based on current rates and modifiers</div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
              <span className="text-lg font-medium text-gray-900">Total Estimated Premium</span>
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-blue-600">
                  {formatCurrency(totalPremium)}
                </span>
                <button
                  onClick={() => onSave(totalPremium)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Save Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Calculator className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          {isValid ? (
            <>
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Calculate</h3>
                <p className="text-gray-600">Click the Calculate Premium button above to generate your estimate.</p>
              </div>
            </>
          ) : (
            <>
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Missing Required Information</h3>
                <ul className="text-left space-y-2 text-sm text-red-600">
                  {errors.map((error, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-red-400">•</span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}
      
      {isAnalyzing && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <Brain className="w-5 h-5 text-blue-600 animate-pulse" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900">AI Analysis in Progress</h3>
              <div className="text-sm text-blue-700">
                Our AI is analyzing your business data to:
                <ul className="mt-1 list-disc list-inside">
                  <li>Evaluate overall risk level</li>
                  <li>Identify key risk factors</li>
                  <li>Generate premium recommendations</li>
                  <li>Suggest safety improvements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <SupplementalCoverageForm
          coverages={data.modifiers.supplementalCoverages || []}
          onChange={(coverages) => onChange({
            ...data,
            modifiers: {
              ...data.modifiers,
              supplementalCoverages: coverages
            }
          })}
        />
      </div>
      
      <PremiumConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmCalculation}
        data={data}
      />
      {calculatedPremiums.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          <p className="mb-2">* Premium calculations are estimates based on provided information.</p>
          <p>Final premium may vary based on underwriting review and additional factors.</p>
        </div>
      )}
    </div>
  );
}