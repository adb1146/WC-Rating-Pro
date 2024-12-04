import React from 'react';
import { Shield, Info } from 'lucide-react';
import { SupplementalCoverage } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface SupplementalCoverageFormProps {
  coverages: SupplementalCoverage[];
  onChange: (coverages: SupplementalCoverage[]) => void;
}

const defaultCoverages: SupplementalCoverage[] = [
  {
    id: 'aircraft_passenger',
    name: 'Aircraft Passenger Coverage',
    description: 'Coverage for employees while occupying, entering, or exiting aircraft used in business operations',
    premium: 5000,
    selected: false,
    required: false,
    limits: {
      perOccurrence: 5000000,
      aggregate: 10000000
    }
  },
  {
    id: 'aircraft_crew',
    name: 'Aircraft Crew Coverage',
    description: 'Specialized coverage for pilots and crew members operating company aircraft',
    premium: 7500,
    selected: false,
    required: false,
    limits: {
      perOccurrence: 5000000,
      aggregate: 10000000
    }
  },
  {
    id: 'usl&h',
    name: 'USL&H Coverage',
    description: 'Coverage for maritime workers under the United States Longshore and Harbor Workers Compensation Act',
    premium: 2500,
    selected: false,
    required: false,
    limits: {
      perOccurrence: 1000000,
      aggregate: 2000000
    }
  },
  {
    id: 'voluntary_comp',
    name: 'Voluntary Compensation',
    description: 'Extends coverage to employees not subject to state workers compensation laws',
    premium: 1500,
    selected: false,
    required: false,
    limits: {
      perOccurrence: 1000000,
      aggregate: 1000000
    }
  },
  {
    id: 'foreign_coverage',
    name: 'Foreign Coverage',
    description: 'Coverage for employees temporarily working outside the United States',
    premium: 3000,
    selected: false,
    required: false,
    limits: {
      perOccurrence: 1000000,
      aggregate: 2000000
    }
  },
  {
    id: 'stop_gap',
    name: 'Stop Gap Coverage',
    description: 'Employers liability coverage for monopolistic state operations',
    premium: 2000,
    selected: false,
    required: false,
    limits: {
      perOccurrence: 1000000,
      aggregate: 1000000
    }
  }
];

export function SupplementalCoverageForm({ coverages = defaultCoverages, onChange }: SupplementalCoverageFormProps) {
  const handleToggleCoverage = (id: string) => {
    const updatedCoverages = coverages.map(coverage => 
      coverage.id === id ? { ...coverage, selected: !coverage.selected } : coverage
    );
    onChange(updatedCoverages);
  };

  const selectedPremium = coverages
    .filter(coverage => coverage.selected)
    .reduce((sum, coverage) => sum + coverage.premium, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Supplemental Coverages</h2>
        </div>
        {selectedPremium > 0 && (
          <div className="text-sm font-medium text-gray-900">
            Selected Premium: {formatCurrency(selectedPremium)}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {coverages.map((coverage) => (
          <div
            key={coverage.id}
            className={`relative border rounded-lg p-4 transition-colors ${
              coverage.selected ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-gray-900">{coverage.name}</h3>
                  {coverage.required && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Required
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600">{coverage.description}</p>
                {coverage.limits && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Info className="w-4 h-4" />
                    <span>
                      Limits: {formatCurrency(coverage.limits.perOccurrence)} per occurrence / {formatCurrency(coverage.limits.aggregate)} aggregate
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-lg font-medium text-gray-900">
                  {formatCurrency(coverage.premium)}
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={coverage.selected}
                    onChange={() => handleToggleCoverage(coverage.id)}
                    disabled={coverage.required}
                  />
                  <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 
                    peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] 
                    after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 
                    after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                    peer-checked:bg-blue-600`}
                  />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            Supplemental coverages provide additional protection beyond standard workers' compensation coverage. 
            Select the coverages that best match your business needs and operations.
          </p>
        </div>
      </div>
    </div>
  );
}