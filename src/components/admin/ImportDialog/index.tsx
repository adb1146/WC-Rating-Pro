import React from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import { RatingFactor } from '../../../types';
import { validateImportData } from '../../../utils/validation';
import { logAuditEvent } from '../../../utils/audit';
import { useAuth } from '../../../contexts/AuthContext';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: RatingFactor[]) => void;
}

export function ImportDialog({ isOpen, onClose, onImport }: ImportDialogProps) {
  const [error, setError] = React.useState<string>();
  const [preview, setPreview] = React.useState<RatingFactor[]>();
  const { user } = useAuth();
  
  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      let data: RatingFactor[];

      if (file.type === 'application/json') {
        data = JSON.parse(text);
      } else if (file.type === 'text/csv') {
        data = parseCSV(text);
      } else {
        throw new Error('Unsupported file type. Please upload JSON or CSV.');
      }

      const { isValid, errors } = validateImportData(data);
      if (!isValid) {
        setError(errors.join('\n'));
        return;
      }

      setPreview(data);
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    }
  };

  const handleConfirmImport = () => {
    if (!preview) return;
    
    logAuditEvent({
      userId: user?.id || 'unknown',
      action: 'import',
      entityType: 'rating_factor',
      entityId: 'bulk',
      changes: { count: preview.length }
    });

    onImport(preview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Import Data
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept=".json,.csv"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">JSON or CSV up to 10MB</p>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 rounded-md">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <h4 className="font-medium">Import Error</h4>
                  </div>
                  <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
                </div>
              )}

              {preview && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {preview.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.version}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              onClick={handleConfirmImport}
              disabled={!preview || !!error}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-300 sm:ml-3 sm:w-auto"
            >
              Import
            </button>
            <button
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function parseCSV(text: string): RatingFactor[] {
  const lines = text.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const factor: Partial<RatingFactor> = {
      id: Date.now().toString(),
    };
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      if (value) {
        factor[header.trim() as keyof RatingFactor] = value;
      }
    });
    
    return factor as RatingFactor;
  });
}