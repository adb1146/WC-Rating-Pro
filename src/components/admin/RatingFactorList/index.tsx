import React from 'react';
import { Edit2, Trash2, Calendar, AlertCircle, Download, Upload, History } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { RatingFactorForm } from '../RatingFactorForm';
import { ExportDialog } from '../ExportDialog';
import { ImportDialog } from '../ImportDialog';
import { logAuditEvent } from '../../../utils/audit';
import { createNewVersion } from '../../../utils/version';

interface RatingFactor {
  id: string;
  name: string;
  description: string;
  effectiveDate: string;
  expirationDate: string;
  status: 'active' | 'pending' | 'expired';
  version: string;
}

interface RatingFactorListProps {
  searchQuery: string;
}

const sampleFactors: RatingFactor[] = [
  {
    id: '1',
    name: 'Experience Modification Factor',
    description: 'Adjusts premium based on past claims experience',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    status: 'active',
    version: '1.0.0',
  },
  {
    id: '2',
    name: 'Schedule Credit',
    description: 'Credit applied based on risk characteristics',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    status: 'active',
    version: '1.0.0',
  },
];

export function RatingFactorList({ searchQuery }: RatingFactorListProps) {
  const [factors, setFactors] = React.useState(sampleFactors);
  const [selectedFactor, setSelectedFactor] = React.useState<RatingFactor | undefined>();
  const { hasPermission } = useAuth();
  const [showForm, setShowForm] = React.useState(false);
  const [showExport, setShowExport] = React.useState(false);
  const [showImport, setShowImport] = React.useState(false);
  const [showVersions, setShowVersions] = React.useState<string | null>(null);
  const { user } = useAuth();

  const filteredFactors = sampleFactors.filter(
    (factor) =>
      factor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      factor.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (factor: RatingFactor) => {
    setSelectedFactor(factor);
    setShowForm(true);
  };

  const handleDelete = (factorId: string) => {
    if (confirm('Are you sure you want to delete this rating factor?')) {
      setFactors(factors.filter(f => f.id !== factorId));
      logAuditEvent({
        userId: user?.id || 'unknown',
        action: 'delete',
        entityType: 'rating_factor',
        entityId: factorId,
        changes: {}
      });
    }
  };

  const handleImport = (importedFactors: RatingFactor[]) => {
    setFactors(prev => [...prev, ...importedFactors]);
  };

  const handleCreateVersion = (factor: RatingFactor) => {
    const newVersion = createNewVersion(factor);
    setFactors(prev => [...prev, newVersion]);
    
    logAuditEvent({
      userId: user?.id || 'unknown',
      action: 'create_version',
      entityType: 'rating_factor',
      entityId: factor.id,
      changes: {
        oldVersion: factor.version,
        newVersion: newVersion.version
      }
    });
  };

  const handleSave = (factor: RatingFactor) => {
    const isNew = !selectedFactor;
    const newFactor = isNew 
      ? { ...factor, id: Date.now().toString() }
      : factor;

    if (selectedFactor) {
      setFactors(factors.map(f => f.id === selectedFactor.id ? newFactor : f));
    } else {
      setFactors([...factors, newFactor]);
    }

    logAuditEvent({
      userId: user?.id || 'unknown',
      action: isNew ? 'create' : 'update',
      entityType: 'rating_factor',
      entityId: newFactor.id,
      changes: isNew ? newFactor : {
        before: selectedFactor,
        after: newFactor
      }
    });
  };

  return (
    <div className="overflow-x-auto relative">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {hasPermission('export_data') && (
          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white rounded-md shadow-sm border border-gray-200"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        )}
        {hasPermission('import_data') && (
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white rounded-md shadow-sm border border-gray-200"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
        )}
      </div>

      <RatingFactorForm
        factor={selectedFactor}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedFactor(undefined);
        }}
        onSave={handleSave}
      />

      <ExportDialog
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        data={factors}
      />

      <ImportDialog
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleImport}
      />

      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
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
          {filteredFactors.map((factor) => (
            <tr key={factor.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {factor.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {factor.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {factor.effectiveDate}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full
                  ${factor.status === 'active' ? 'bg-green-100 text-green-800' :
                    factor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}>
                  {factor.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {factor.version}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleEdit(factor)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCreateVersion(factor)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                  title="Create New Version"
                >
                  <History className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(factor.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
          {filteredFactors.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center">
                <div className="flex flex-col items-center text-gray-500">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p>No rating factors found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}