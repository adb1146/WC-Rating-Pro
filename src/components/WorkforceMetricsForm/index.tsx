import React from 'react';
import { Users, Percent, Clock, Laptop } from 'lucide-react';
import { WorkforceMetrics } from '../../types';

interface WorkforceMetricsFormProps {
  data: WorkforceMetrics;
  onChange: (data: WorkforceMetrics) => void;
}

export function WorkforceMetricsForm({ data, onChange }: WorkforceMetricsFormProps) {
  const handleChange = (field: keyof WorkforceMetrics, value: number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Workforce Metrics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-1">
              <Percent className="w-4 h-4" />
              Annual Turnover Rate
            </div>
          </label>
          <div className="relative">
            <input
              type="number"
              value={data.turnoverRate || ''}
              onChange={(e) => handleChange('turnoverRate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.01"
              min="0"
              max="1"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">%</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">Enter as decimal (e.g., 0.15 for 15%)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Average Employee Tenure (Years)
            </div>
          </label>
          <input
            type="number"
            value={data.avgTenure || ''}
            onChange={(e) => handleChange('avgTenure', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.5"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Training Hours per Employee (Annual)
            </div>
          </label>
          <input
            type="number"
            value={data.trainingHoursPerYear || ''}
            onChange={(e) => handleChange('trainingHoursPerYear', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-1">
              <Laptop className="w-4 h-4" />
              Remote Work Percentage
            </div>
          </label>
          <div className="relative">
            <input
              type="number"
              value={data.remoteWorkPercentage || ''}
              onChange={(e) => handleChange('remoteWorkPercentage', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.05"
              min="0"
              max="1"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">%</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">Enter as decimal (e.g., 0.60 for 60%)</p>
        </div>
      </div>
    </div>
  );
}