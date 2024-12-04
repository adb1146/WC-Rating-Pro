import React from 'react';
import { Briefcase, Plus, Trash2, DollarSign, Users, Search } from 'lucide-react';
import { PayrollInfo } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { states } from '../../utils/constants';
import { ValidationMessage } from '../ValidationMessage';
import { AIClassCodeAssistant } from '../AIClassCodeAssistant';
import { supabase } from '../../utils/supabase';

interface ClassCodeSearchResult {
  class_code: string;
  description: string;
  base_rate: number;
  hazard_group: string;
  industry_group: string;
}

interface PayrollFormProps {
  payrollInfo: PayrollInfo[];
  onChange: (payrollInfo: PayrollInfo[]) => void;
}

const emptyPayroll: PayrollInfo = {
  stateCode: '',
  classCode: '',
  employeeCount: 0,
  annualPayroll: 0,
  jobDescription: '',
};

export function PayrollForm({ payrollInfo, onChange }: PayrollFormProps) {
  const [searchResults, setSearchResults] = React.useState<ClassCodeSearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerms, setSearchTerms] = React.useState<{[key: number]: string}>({});
  const [selectedState, setSelectedState] = React.useState<string>('');

  const searchClassCodes = async (stateCode: string, searchTerm: string) => {
    if (!stateCode || searchTerm.length < 3) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('search_class_codes', {
        p_state_code: stateCode,
        p_search_term: searchTerm
      });

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching class codes:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (selectedState && searchTerms[0] && searchTerms[0].length >= 3) {
        searchClassCodes(selectedState, searchTerms[0]);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [selectedState, searchTerms[0]]);

  const handleAddPayroll = () => {
    onChange([...payrollInfo, { ...emptyPayroll }]);
  };

  const handleRemovePayroll = (index: number) => {
    onChange(payrollInfo.filter((_, i) => i !== index));
  };

  const handlePayrollChange = (index: number, field: keyof PayrollInfo, value: any) => {
    const updatedPayroll = payrollInfo.map((info, i) => {
      if (i === index) {
        if (field === 'stateCode') {
          setSelectedState(value);
          setSearchResults([]);
          setSearchTerms(prev => ({ ...prev, [index]: '' }));
        }
        return { ...info, [field]: value };
      }
      return info;
    });
    onChange(updatedPayroll);
  };

  const handleClassCodeSelect = (index: number, classCode: ClassCodeSearchResult) => {
    const updatedPayroll = payrollInfo.map((info, i) => {
      if (i === index) {
        return {
          ...info,
          classCode: classCode.class_code,
          jobDescription: classCode.description
        };
      }
      return info;
    });
    setSearchResults([]);
    onChange(updatedPayroll);
  };

  const totalPayroll = payrollInfo.reduce((sum, info) => sum + info.annualPayroll, 0);
  const totalEmployees = payrollInfo.reduce((sum, info) => sum + info.employeeCount, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Payroll Information</h2>
        </div>
        {payrollInfo.length === 0 && (
          <ValidationMessage message="At least one payroll classification is required" />
        )}
        <button
          type="button"
          onClick={handleAddPayroll}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Classification
        </button>
      </div>

      {payrollInfo.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Total Employees: {totalEmployees}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Total Annual Payroll: {formatCurrency(totalPayroll)}</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {payrollInfo.map((info, index) => (
          <div key={index} className="relative border border-gray-200 rounded-lg p-4">
            <button
              type="button"
              onClick={() => handleRemovePayroll(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  value={info.stateCode}
                  onChange={(e) => handlePayrollChange(index, 'stateCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchTerms[index] || ''}
                      onChange={(e) => setSearchTerms(prev => ({ ...prev, [index]: e.target.value }))}
                      className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Search class codes..."
                      disabled={!info.stateCode}
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text" 
                    value={info.classCode}
                    readOnly
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    placeholder="Code"
                  />
                </div>
                {searchTerms[index] && searchTerms[index].length >= 3 && searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                    {searchResults.map((code) => (
                      <button
                        key={code.class_code}
                        type="button"
                        onClick={() => {
                          handleClassCodeSelect(index, code);
                          setSearchTerms(prev => ({ ...prev, [index]: '' }));
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-blue-600">{code.class_code}</span>
                          <span className="text-sm text-blue-600">{code.base_rate.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-gray-600 truncate">{code.description}</p>
                          <span className="text-xs text-gray-500 ml-2">{code.industry_group}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {searchTerms[index] && searchTerms[index].length >= 3 && searchResults.length === 0 && !loading && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-4 text-center text-gray-500">
                    No matching class codes found
                  </div>
                )}
                {!info.stateCode && (
                  <div className="mt-1 text-sm text-gray-500">
                    Select a state to search class codes
                  </div>
                )}
                <AIClassCodeAssistant
                  stateCode={info.stateCode}
                  workDescription={info.jobDescription}
                  onSuggestion={({ classCode, description }) => {
                    handleClassCodeSelect(index, {
                      class_code: classCode,
                      description,
                      base_rate: 0,
                      hazard_group: '',
                      industry_group: ''
                    });
                  }}
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
                  value={info.employeeCount || ''}
                  onChange={(e) => handlePayrollChange(index, 'employeeCount', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Annual Payroll
                  </div>
                </label>
                <input
                  type="number"
                  value={info.annualPayroll || ''}
                  onChange={(e) => handlePayrollChange(index, 'annualPayroll', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  value={info.jobDescription}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Describe the work performed by employees in this classification..."
                />
              </div>
            </div>
          </div>
        ))}

        {payrollInfo.length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Briefcase className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No payroll classifications added.</p>
            <button
              type="button"
              onClick={handleAddPayroll}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first classification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}