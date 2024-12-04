import React from 'react';
import { Users, Plus, Trash2, Calendar, DollarSign } from 'lucide-react';
import { SubcontractorInfo } from '../../types';
import { AIDescriptionAssistant } from '../AIDescriptionAssistant';
import { formatCurrency } from '../../utils/formatters';

interface SubcontractorFormProps {
  subcontractors: SubcontractorInfo[];
  onChange: (subcontractors: SubcontractorInfo[]) => void;
}

const emptySubcontractor: SubcontractorInfo = {
  name: '',
  workType: '',
  certificateExpiration: '',
  annualCost: 0,
  employeeCount: 0,
};

export function SubcontractorForm({ subcontractors, onChange }: SubcontractorFormProps) {
  const handleAddSubcontractor = () => {
    onChange([...subcontractors, { ...emptySubcontractor }]);
  };

  const handleRemoveSubcontractor = (index: number) => {
    onChange(subcontractors.filter((_, i) => i !== index));
  };

  const handleSubcontractorChange = (index: number, field: keyof SubcontractorInfo, value: any) => {
    const updatedSubcontractors = subcontractors.map((subcontractor, i) => {
      if (i === index) {
        return { ...subcontractor, [field]: value };
      }
      return subcontractor;
    });
    onChange(updatedSubcontractors);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Subcontractors</h2>
        </div>
        <button
          type="button"
          onClick={handleAddSubcontractor}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Subcontractor
        </button>
      </div>

      <div className="space-y-6">
        {subcontractors.map((subcontractor, index) => (
          <div key={index} className="relative border border-gray-200 rounded-lg p-4">
            <button
              type="button"
              onClick={() => handleRemoveSubcontractor(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcontractor Name
                </label>
                <input
                  type="text"
                  value={subcontractor.name}
                  onChange={(e) => handleSubcontractorChange(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Work
                </label>
                <input
                  type="text"
                  value={subcontractor.workType}
                  onChange={(e) => handleSubcontractorChange(index, 'workType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Facility Maintenance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Certificate Expiration
                  </div>
                </label>
                <input
                  type="date"
                  value={subcontractor.certificateExpiration}
                  onChange={(e) => handleSubcontractorChange(index, 'certificateExpiration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Annual Contract Cost
                  </div>
                </label>
                <input
                  type="number"
                  value={subcontractor.annualCost || ''}
                  onChange={(e) => handleSubcontractorChange(index, 'annualCost', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Number of Employees
                  </div>
                </label>
                <input
                  type="number"
                  value={subcontractor.employeeCount || ''}
                  onChange={(e) => handleSubcontractorChange(index, 'employeeCount', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
                <AIDescriptionAssistant
                  field="subcontractor work"
                  value={subcontractor.workType}
                  context={{
                    name: subcontractor.name,
                    employeeCount: subcontractor.employeeCount,
                    annualCost: subcontractor.annualCost
                  }}
                  onSuggestion={(suggestion) => handleSubcontractorChange(index, 'workType', suggestion)}
                />
              </div>
            </div>
          </div>
        ))}

        {subcontractors.length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No subcontractors added.</p>
            <button
              type="button"
              onClick={handleAddSubcontractor}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first subcontractor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}