import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { BusinessInfo } from '../../types';
import { initialBusinessInfo } from '../../App';
import { validateBusinessInfo } from '../../utils/validation';

interface FormProgressProps {
  data: BusinessInfo;
  currentSection: string;
  onNavigate: (section: string) => void;
}

interface Section {
  id: string;
  title: string;
  validate: (data: BusinessInfo) => boolean;
}

const sections: Section[] = [
  {
    id: 'business',
    title: 'Business Information',
    validate: (data) => !!data.name && !!data.fein && !!data.description && !!data.contactEmail && !!data.contactPhone
  },
  {
    id: 'locations',
    title: 'Locations',
    validate: (data) => data.locations.length > 0 && data.locations.every(loc => 
      !!loc.street1 && !!loc.city && !!loc.state && !!loc.zipCode
    )
  },
  {
    id: 'safety',
    title: 'Safety Programs',
    validate: (data) => data.safetyPrograms.length > 0
  },
  {
    id: 'risk',
    title: 'Risk Controls',
    validate: (data) => data.riskControls.length > 0
  },
  {
    id: 'subcontractors',
    title: 'Subcontractors',
    validate: (data) => data.subcontractors.length > 0 || data.workforceMetrics.remoteWorkPercentage === 1
  },
  {
    id: 'workforce',
    title: 'Workforce Metrics',
    validate: (data) => data.workforceMetrics.turnoverRate >= 0 && 
      data.workforceMetrics.avgTenure >= 0 && 
      data.workforceMetrics.trainingHoursPerYear > 0
  },
  {
    id: 'insurance',
    title: 'Prior Insurance',
    validate: (data) => data.priorInsurance.length > 0 && data.priorInsurance.every(ins => 
      !!ins.carrier && !!ins.policyNumber && !!ins.effectiveDate && !!ins.expirationDate
    )
  },
  {
    id: 'losses',
    title: 'Loss History',
    validate: (data) => data.lossHistory.length > 0 && data.lossHistory.every(loss => 
      !!loss.date && !!loss.type && !!loss.description && loss.amount > 0 && !!loss.claimNumber
    )
  },
  {
    id: 'payroll',
    title: 'Payroll',
    validate: (data) => data.payrollInfo.length > 0 && data.payrollInfo.every(info =>
      !!info.stateCode && !!info.classCode && info.annualPayroll > 0 && info.employeeCount > 0
    )
  },
  {
    id: 'premium',
    title: 'Premium Calculation',
    validate: (data) => data.modifiers.experienceMod !== 1.0 || 
                       data.modifiers.scheduleCredit !== 0 || 
                       data.modifiers.safetyCredit !== 0
  }
];

export function FormProgress({ data, currentSection, onNavigate }: FormProgressProps) {
  const { isValid } = validateBusinessInfo(data);
  const completedSections = sections.filter(section => section.validate(data));
  const progress = (completedSections.length / sections.length) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Application Progress</h3>
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-gray-600">
            {completedSections.length} of {sections.length} sections complete
          </div>
          <div className="w-32 h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {sections.map((section) => {
          const isComplete = section.validate(data);
          const isCurrent = section.id === currentSection;

          return (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className={`p-3 rounded-lg text-sm font-medium text-left transition-colors
                ${isCurrent ? 'bg-blue-50 text-blue-700 border-2 border-blue-500' :
                  isComplete ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}
                hover:bg-opacity-75`}
            >
              <div className="flex items-center justify-between">
                <span>{section.title}</span>
                {isComplete ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!isValid && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <AlertCircle className="w-4 h-4" />
            <span>Please complete all required fields to generate a quote</span>
          </div>
        </div>
      )}
    </div>
  );
}