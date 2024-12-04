import React from 'react';
import { Building2, Mail, Phone, HelpCircle, Info, Brain } from 'lucide-react';
import { BusinessInfo, EntityType } from '../../types';
import { AIDescriptionAssistant } from '../AIDescriptionAssistant';
import { AIFieldAssistant } from '../AIFieldAssistant';
import { ValidationMessage } from '../ValidationMessage';

interface FieldTooltipProps {
  content: string;
}

function FieldTooltip({ content }: FieldTooltipProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);
  return (
    <div className="relative inline-block">
      <HelpCircle 
        className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help ml-1" 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      {showTooltip && (
        <div className="absolute z-10 w-64 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -right-2 top-6">
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -top-1 right-3" />
        </div>
      )}
    </div>
  );
}

interface BusinessFormProps {
  data: BusinessInfo;
  onChange: (data: BusinessInfo) => void;
}

const entityTypes: { value: EntityType; label: string }[] = [
  { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'llc', label: 'Limited Liability Company' },
  { value: 'other', label: 'Other' },
];

export function BusinessForm({ data, onChange }: BusinessFormProps) {
  const [activeField, setActiveField] = React.useState<string>('');

  const handleChange = (field: keyof BusinessInfo, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleFocus = (field: string) => {
    setActiveField(field);
  };

  const handleBlur = () => {
    setActiveField('');
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <div className="flex-1">
            <h3 className="font-medium text-blue-900">AI-Assisted Form</h3>
            <p className="text-sm text-blue-700">Our AI will help validate your business information and suggest improvements</p>
          </div>
          <div className="flex items-center gap-1 text-sm text-blue-600">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            AI Active
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                Business Name
                <FieldTooltip content="Enter the legal business name as it appears on your tax documents" />
              </div>
            </label>
            {!data.name && (
              <ValidationMessage message="Business name is required" />
            )}
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onFocus={() => handleFocus('businessName')}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                ${!data.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
              placeholder="Legal Business Name"
            />
            <AIFieldAssistant
              field="businessName"
              value={data.name}
              businessInfo={data}
              onSuggestion={(suggestion) => handleChange('name', suggestion)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entity Type
            </label>
            <select
              value={data.entityType}
              onChange={(e) => handleChange('entityType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {entityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                Federal Employer ID (FEIN)
                <FieldTooltip content="Format: XX-XXXXXXX. Your 9-digit Federal Employer Identification Number" />
              </div>
            </label>
            {!data.fein && (
              <ValidationMessage message="FEIN is required" />
            )}
            <input
              type="text"
              value={data.fein}
              onChange={(e) => handleChange('fein', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                ${!data.fein ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
              placeholder="XX-XXXXXXX"
              pattern="\d{2}-\d{7}"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years in Business
            </label>
            <input
              type="number"
              value={data.yearsInBusiness}
              onChange={(e) => handleChange('yearsInBusiness', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Description
          </label>
          {!data.description && (
            <ValidationMessage message="Business description is required" />
          )}
          <textarea
            value={data.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onFocus={() => handleFocus('businessDescription')}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
              ${!data.description ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
            rows={4}
            placeholder="Detailed description of business operations..."
          />
          <AIDescriptionAssistant
            field="business"
            value={data.description}
            context={{
              entityType: data.entityType,
              yearsInBusiness: data.yearsInBusiness,
              locations: data.locations.length
            }}
            onSuggestion={(suggestion) => handleChange('description', suggestion)}
          />
          <div className="mt-1 text-sm text-gray-500 flex items-center gap-1">
            <Info className="w-4 h-4" />
            Include main business activities, types of work performed, and safety measures
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Contact Email
              </div>
              {!data.contactEmail && (
                <ValidationMessage message="Contact email is required" />
              )}
            </label>
            <input
              type="email"
              value={data.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="contact@business.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                Contact Phone
              </div>
              {!data.contactPhone && (
                <ValidationMessage message="Contact phone is required" />
              )}
            </label>
            <input
              type="tel"
              value={data.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(XXX) XXX-XXXX"
            />
          </div>
        </div>
      </div>
    </div>
  );
}