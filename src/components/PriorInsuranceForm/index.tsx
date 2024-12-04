import React from 'react';
import { History, Plus, Trash2, DollarSign } from 'lucide-react';
import { PriorInsurance } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface PriorInsuranceFormProps {
  priorInsurance: PriorInsurance[];
  onChange: (priorInsurance: PriorInsurance[]) => void;
}

const emptyInsurance: PriorInsurance = {
  carrier: '',
  policyNumber: '',
  effectiveDate: '',
  expirationDate: '',
  premiumAmount: 0,
};

export function PriorInsuranceForm({ priorInsurance, onChange }: PriorInsuranceFormProps) {
  const handleAddInsurance = () => {
    onChange([...priorInsurance, { ...emptyInsurance }]);
  };

  const handleRemoveInsurance = (index: number) => {
    onChange(priorInsurance.filter((_, i) => i !== index));
  };

  const handleInsuranceChange = (index: number, field: keyof PriorInsurance, value: any) => {
    const updatedInsurance = priorInsurance.map((insurance, i) => {
      if (i === index) {
        return { ...insurance, [field]: value };
      }
      return insurance;
    });
    onChange(updatedInsurance);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Prior Insurance History</h2>
        </div>
        <button
          type="button"
          onClick={handleAddInsurance}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Prior Insurance
        </button>
      </div>

      <div className="space-y-6">
        {priorInsurance.map((insurance, index) => (
          <div key={index} className="relative border border-gray-200 rounded-lg p-4">
            <button
              type="button"
              onClick={() => handleRemoveInsurance(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Carrier
                </label>
                <input
                  type="text"
                  value={insurance.carrier}
                  onChange={(e) => handleInsuranceChange(index, 'carrier', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Insurance Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Policy Number
                </label>
                <input
                  type="text"
                  value={insurance.policyNumber}
                  onChange={(e) => handleInsuranceChange(index, 'policyNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="WC-1234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effective Date
                </label>
                <input
                  type="date"
                  value={insurance.effectiveDate}
                  onChange={(e) => handleInsuranceChange(index, 'effectiveDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={insurance.expirationDate}
                  onChange={(e) => handleInsuranceChange(index, 'expirationDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Premium Amount
                  </div>
                </label>
                <input
                  type="number"
                  value={insurance.premiumAmount || ''}
                  onChange={(e) => handleInsuranceChange(index, 'premiumAmount', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        ))}

        {priorInsurance.length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <History className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No prior insurance records added.</p>
            <button
              type="button"
              onClick={handleAddInsurance}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first insurance record
            </button>
          </div>
        )}
      </div>
    </div>
  );
}