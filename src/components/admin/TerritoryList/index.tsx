import React from 'react';
import { MapPin, Edit2, Trash2 } from 'lucide-react';
import { TerritoryConfig } from '../../../types/admin';
import { useAuth } from '../../../contexts/AuthContext';

interface TerritoryListProps {
  searchQuery: string;
}

const sampleTerritories: TerritoryConfig[] = [
  {
    id: '1',
    stateCode: 'CA',
    territoryCode: 'CA-01',
    description: 'Los Angeles Metropolitan Area',
    rateMultiplier: 1.15,
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31'
  },
  {
    id: '2',
    stateCode: 'NY',
    territoryCode: 'NY-01',
    description: 'New York City Metropolitan Area',
    rateMultiplier: 1.25,
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31'
  }
];

export function TerritoryList({ searchQuery }: TerritoryListProps) {
  const { hasPermission } = useAuth();
  const [territories, setTerritories] = React.useState(sampleTerritories);

  const filteredTerritories = territories.filter(
    (territory) =>
      territory.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      territory.stateCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      territory.territoryCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Territory
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              State
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rate Multiplier
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
          {filteredTerritories.map((territory) => (
            <tr key={territory.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {territory.territoryCode}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {territory.stateCode}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {territory.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {territory.rateMultiplier.toFixed(2)}x
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {territory.effectiveDate}
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