import React from 'react';
import { Edit2, Trash2, Calendar } from 'lucide-react';

interface RatingTable {
  id: string;
  name: string;
  description: string;
  effectiveDate: string;
  expirationDate: string;
  status: 'active' | 'pending' | 'expired';
  version: string;
  stateCode: string;
}

interface RatingTableListProps {
  searchQuery: string;
}

const sampleTables: RatingTable[] = [
  {
    id: '1',
    name: 'CA Class Code Rates',
    description: 'Base rates for California classification codes',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    status: 'active',
    version: '2024.1',
    stateCode: 'CA',
  },
  {
    id: '2',
    name: 'NY Class Code Rates',
    description: 'Base rates for New York classification codes',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    status: 'active',
    version: '2024.1',
    stateCode: 'NY',
  },
];

export function RatingTableList({ searchQuery }: RatingTableListProps) {
  const filteredTables = sampleTables.filter(
    (table) =>
      table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.stateCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              State
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Effective Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Version
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredTables.map((table) => (
            <tr key={table.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {table.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {table.stateCode}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {table.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {table.effectiveDate}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full
                  ${table.status === 'active' ? 'bg-green-100 text-green-800' :
                    table.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}>
                  {table.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {table.version}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-3">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}