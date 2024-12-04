import React from 'react';
import { ChevronDown, ChevronRight, Calculator } from 'lucide-react';
import { PremiumBreakdown } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface PremiumCalculationDetailsProps {
  breakdown: PremiumBreakdown;
  modifiers: {
    experienceMod: number;
    scheduleCredit: number;
    safetyCredit: number;
  };
}

export function PremiumCalculationDetails({ breakdown, modifiers }: PremiumCalculationDetailsProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const manualPremiumCalculation = (breakdown.payroll / 100) * breakdown.baseRate;
  const experienceModAdjustment = manualPremiumCalculation * (modifiers.experienceMod - 1);
  const scheduleCreditAdjustment = manualPremiumCalculation * -modifiers.scheduleCredit;
  const safetyCreditAdjustment = manualPremiumCalculation * -modifiers.safetyCredit;

  return (
    <div className="border-t border-gray-200 pt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full text-sm text-gray-600 hover:text-gray-900"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
        <Calculator className="w-4 h-4" />
        <span>Calculation Details</span>
      </button>

      {isExpanded && (
        <div className="mt-3 pl-6 space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-x-4">
            <div className="text-gray-600">Manual Premium Calculation:</div>
            <div>
              <div className="text-gray-900">
                ({formatCurrency(breakdown.payroll)} ÷ 100) × {breakdown.baseRate} = {formatCurrency(manualPremiumCalculation)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Payroll divided by 100, multiplied by base rate
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <div className="text-gray-600">Experience Modification:</div>
            <div>
              <div className="text-gray-900">
                {formatCurrency(manualPremiumCalculation)} × ({modifiers.experienceMod} - 1) = {formatCurrency(experienceModAdjustment)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Manual premium adjusted by experience mod factor
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <div className="text-gray-600">Schedule Credit:</div>
            <div>
              <div className="text-gray-900">
                {formatCurrency(manualPremiumCalculation)} × {modifiers.scheduleCredit} = {formatCurrency(scheduleCreditAdjustment)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Credit applied based on risk characteristics
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <div className="text-gray-600">Safety Credit:</div>
            <div>
              <div className="text-gray-900">
                {formatCurrency(manualPremiumCalculation)} × {modifiers.safetyCredit} = {formatCurrency(safetyCreditAdjustment)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Credit applied for safety programs
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 pt-2 border-t border-gray-100 font-medium">
            <div className="text-gray-900">Final Premium:</div>
            <div className="text-gray-900">
              {formatCurrency(breakdown.finalPremium)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}