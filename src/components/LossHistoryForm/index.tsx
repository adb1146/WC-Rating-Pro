import React from 'react';
import { FileWarning, Plus, Trash2, DollarSign } from 'lucide-react';
import { LossHistory } from '../../types';
import { AIDescriptionAssistant } from '../AIDescriptionAssistant';
import { formatCurrency } from '../../utils/formatters';

interface LossHistoryFormProps {
  lossHistory: LossHistory[];
  onChange: (lossHistory: LossHistory[]) => void;
}

const emptyLoss: LossHistory = {
  date: '',
  type: '',
  description: '',
  amount: 0,
  status: 'open',
  claimNumber: '',
};

export function LossHistoryForm({ lossHistory, onChange }: LossHistoryFormProps) {
  const handleAddLoss = () => {
    onChange([...lossHistory, { ...emptyLoss }]);
  };

  const handleRemoveLoss = (index: number) => {
    onChange(lossHistory.filter((_, i) => i !== index));
  };

  const handleLossChange = (index: number, field: keyof LossHistory, value: any) => {
    const updatedLosses = lossHistory.map((loss, i) => {
      if (i === index) {
        return { ...loss, [field]: value };
      }
      return loss;
    });
    onChange(updatedLosses);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileWarning className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Loss History</h2>
        </div>
        <button
          type="button"
          onClick={handleAddLoss}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Loss Record
        </button>
      </div>

      <div className="space-y-6">
        {lossHistory.map((loss, index) => (
          <div key={index} className="relative border border-gray-200 rounded-lg p-4">
            <button
              type="button"
              onClick={() => handleRemoveLoss(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Loss
                </label>
                <input
                  type="date"
                  value={loss.date}
                  onChange={(e) => handleLossChange(index, 'date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Loss
                </label>
                <select
                  value={loss.type}
                  onChange={(e) => handleLossChange(index, 'type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="medical_only">Medical Only</option>
                  <option value="indemnity">Indemnity</option>
                  <option value="death">Death</option>
                  <option value="property_damage">Property Damage</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={loss.description}
                  onChange={(e) => handleLossChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Describe the circumstances of the loss..."
                />
                <AIDescriptionAssistant
                  field="loss incident"
                  value={loss.description}
                  context={{
                    type: loss.type,
                    amount: loss.amount,
                    status: loss.status,
                    date: loss.date
                  }}
                  onSuggestion={(suggestion) => handleLossChange(index, 'description', suggestion)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Loss Amount
                  </div>
                </label>
                <input
                  type="number"
                  value={loss.amount || ''}
                  onChange={(e) => handleLossChange(index, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={loss.status}
                  onChange={(e) => handleLossChange(index, 'status', e.target.value as 'open' | 'closed')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Claim Number
                </label>
                <input
                  type="text"
                  value={loss.claimNumber}
                  onChange={(e) => handleLossChange(index, 'claimNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="CLM-1234567"
                />
              </div>
            </div>
          </div>
        ))}

        {lossHistory.length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <FileWarning className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No loss history records added.</p>
            <button
              type="button"
              onClick={handleAddLoss}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first loss record
            </button>
          </div>
        )}
      </div>
    </div>
  );
}