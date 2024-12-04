import React from 'react';
import { Calculator, Edit2, Trash2 } from 'lucide-react';
import { PremiumRuleConfig } from '../../../types/admin';
import { useAuth } from '../../../contexts/AuthContext';
import { formatCurrency } from '../../../utils/formatters';

interface PremiumRuleListProps {
  searchQuery: string;
}

const sampleRules: PremiumRuleConfig[] = [
  {
    id: '1',
    stateCode: 'CA',
    ruleType: 'discount',
    name: 'Premium Size Discount',
    description: 'Discount based on total premium size',
    parameters: {
      ranges: [
        { min: 0, max: 10000, factor: 0 },
        { min: 10001, max: 50000, factor: 0.05 },
        { min: 50001, max: 100000, factor: 0.1 }
      ]
    },
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31'
  },
  {
    id: '2',
    stateCode: 'ALL',
    ruleType: 'supplemental',
    name: 'Aircraft Passenger Coverage',
    description: 'Coverage for employees while occupying, entering, or exiting aircraft',
    parameters: {
      premium: 5000,
      limits: {
        perOccurrence: 5000000,
        aggregate: 10000000
      }
    },
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31'
  },
  {
    id: '3',
    stateCode: 'ALL',
    ruleType: 'supplemental',
    name: 'USL&H Coverage',
    description: 'Coverage for maritime workers under USL&H Act',
    parameters: {
      premium: 2500,
      limits: {
        perOccurrence: 1000000,
        aggregate: 2000000
      }
    },
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31'
  }
];

export function PremiumRuleList({ searchQuery }: PremiumRuleListProps) {
  const { hasPermission } = useAuth();
  const [rules, setRules] = React.useState(sampleRules);

  const filteredRules = rules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.stateCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatRuleValue = (rule: PremiumRuleConfig) => {
    if (rule.parameters.ranges) {
      return rule.parameters.ranges.map(range => 
        `${formatCurrency(range.min)}-${formatCurrency(range.max)}: ${(range.factor * 100).toFixed(1)}%`
      ).join(', ');
    } else if (rule.parameters.premium) {
      return formatCurrency(rule.parameters.premium);
    }
    if (rule.parameters.flatAmount) {
      return formatCurrency(rule.parameters.flatAmount);
    }
    return 'N/A';
  };

  const formatLimits = (rule: PremiumRuleConfig) => {
    if (rule.parameters.limits) {
      return `${formatCurrency(rule.parameters.limits.perOccurrence)} / ${formatCurrency(rule.parameters.limits.aggregate)}`;
    }
    return 'N/A';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rule Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              State
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Limits
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Effective Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredRules.map((rule) => (
            <tr key={rule.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {rule.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                {rule.ruleType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {rule.stateCode}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatRuleValue(rule)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatLimits(rule)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calculator className="w-4 h-4" />
                  {rule.effectiveDate}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {hasPermission('edit_rates') && (
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {hasPermission('delete_rates') && (
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}