import React from 'react';
import { Shield, Plus, Trash2, Calendar } from 'lucide-react';
import { SafetyProgram } from '../../types';
import { AIDescriptionAssistant } from '../AIDescriptionAssistant';

interface SafetyProgramFormProps {
  safetyPrograms: SafetyProgram[];
  onChange: (safetyPrograms: SafetyProgram[]) => void;
}

const emptySafetyProgram: SafetyProgram = {
  name: '',
  implementationDate: '',
  lastReviewDate: '',
  description: '',
  status: 'planned',
};

export function SafetyProgramForm({ safetyPrograms, onChange }: SafetyProgramFormProps) {
  const handleAddProgram = () => {
    onChange([...safetyPrograms, { ...emptySafetyProgram }]);
  };

  const handleRemoveProgram = (index: number) => {
    onChange(safetyPrograms.filter((_, i) => i !== index));
  };

  const handleProgramChange = (index: number, field: keyof SafetyProgram, value: any) => {
    const updatedPrograms = safetyPrograms.map((program, i) => {
      if (i === index) {
        return { ...program, [field]: value };
      }
      return program;
    });
    onChange(updatedPrograms);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Safety Programs</h2>
        </div>
        <button
          type="button"
          onClick={handleAddProgram}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Safety Program
        </button>
      </div>

      <div className="space-y-6">
        {safetyPrograms.map((program, index) => (
          <div key={index} className="relative border border-gray-200 rounded-lg p-4">
            <button
              type="button"
              onClick={() => handleRemoveProgram(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Name
                </label>
                <input
                  type="text"
                  value={program.name}
                  onChange={(e) => handleProgramChange(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Ergonomic Assessment Program"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={program.status}
                  onChange={(e) => handleProgramChange(index, 'status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="under_review">Under Review</option>
                  <option value="planned">Planned</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Implementation Date
                  </div>
                </label>
                <input
                  type="date"
                  value={program.implementationDate}
                  onChange={(e) => handleProgramChange(index, 'implementationDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Last Review Date
                  </div>
                </label>
                <input
                  type="date"
                  value={program.lastReviewDate}
                  onChange={(e) => handleProgramChange(index, 'lastReviewDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Description
                </label>
                <textarea
                  value={program.description}
                  onChange={(e) => handleProgramChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Describe the safety program's objectives and key components..."
                />
                <AIDescriptionAssistant
                  field="safety program"
                  value={program.description}
                  context={{
                    programName: program.name,
                    status: program.status,
                    implementationDate: program.implementationDate
                  }}
                  onSuggestion={(suggestion) => handleProgramChange(index, 'description', suggestion)}
                />
              </div>
            </div>
          </div>
        ))}

        {safetyPrograms.length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No safety programs added.</p>
            <button
              type="button"
              onClick={handleAddProgram}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first safety program
            </button>
          </div>
        )}
      </div>
    </div>
  );
}