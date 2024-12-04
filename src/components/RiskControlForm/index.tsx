import React from 'react';
import { AlertTriangle, Plus, Trash2, Calendar, User } from 'lucide-react';
import { RiskControl } from '../../types';
import { AIDescriptionAssistant } from '../AIDescriptionAssistant';

interface RiskControlFormProps {
  riskControls: RiskControl[];
  onChange: (riskControls: RiskControl[]) => void;
}

const emptyRiskControl: RiskControl = {
  hazardType: '',
  controlMeasures: '',
  lastAssessmentDate: '',
  responsiblePerson: '',
  effectiveness: 'medium',
};

export function RiskControlForm({ riskControls, onChange }: RiskControlFormProps) {
  const handleAddControl = () => {
    onChange([...riskControls, { ...emptyRiskControl }]);
  };

  const handleRemoveControl = (index: number) => {
    onChange(riskControls.filter((_, i) => i !== index));
  };

  const handleControlChange = (index: number, field: keyof RiskControl, value: any) => {
    const updatedControls = riskControls.map((control, i) => {
      if (i === index) {
        return { ...control, [field]: value };
      }
      return control;
    });
    onChange(updatedControls);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Risk Controls</h2>
        </div>
        <button
          type="button"
          onClick={handleAddControl}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Risk Control
        </button>
      </div>

      <div className="space-y-6">
        {riskControls.map((control, index) => (
          <div key={index} className="relative border border-gray-200 rounded-lg p-4">
            <button
              type="button"
              onClick={() => handleRemoveControl(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hazard Type
                </label>
                <input
                  type="text"
                  value={control.hazardType}
                  onChange={(e) => handleControlChange(index, 'hazardType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Repetitive Strain"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effectiveness
                </label>
                <select
                  value={control.effectiveness}
                  onChange={(e) => handleControlChange(index, 'effectiveness', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Last Assessment Date
                  </div>
                </label>
                <input
                  type="date"
                  value={control.lastAssessmentDate}
                  onChange={(e) => handleControlChange(index, 'lastAssessmentDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Responsible Person
                  </div>
                </label>
                <input
                  type="text"
                  value={control.responsiblePerson}
                  onChange={(e) => handleControlChange(index, 'responsiblePerson', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full Name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Control Measures
                </label>
                <textarea
                  value={control.controlMeasures}
                  onChange={(e) => handleControlChange(index, 'controlMeasures', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Describe the measures in place to control this hazard..."
                />
                <AIDescriptionAssistant
                  field="risk control measures"
                  value={control.controlMeasures}
                  context={{
                    hazardType: control.hazardType,
                    effectiveness: control.effectiveness,
                    responsiblePerson: control.responsiblePerson
                  }}
                  onSuggestion={(suggestion) => handleControlChange(index, 'controlMeasures', suggestion)}
                />
              </div>
            </div>
          </div>
        ))}

        {riskControls.length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No risk controls added.</p>
            <button
              type="button"
              onClick={handleAddControl}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first risk control
            </button>
          </div>
        )}
      </div>
    </div>
  );
}