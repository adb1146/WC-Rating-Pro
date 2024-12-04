import React from 'react';
import { MapPin, Search, AlertTriangle, Building2, X } from 'lucide-react';
import { Address } from '../../types';
import { researchBusinessLocation } from '../../utils/ai/locationResearch';

interface LocationResearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: Address) => void;
  businessDescription: string;
  state: string;
}

export function LocationResearchDialog({
  isOpen,
  onClose,
  onSelectLocation,
  businessDescription,
  state
}: LocationResearchDialogProps) {
  const [suggestions, setSuggestions] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = React.useState<Address | null>(null);

  React.useEffect(() => {
    if (isOpen && businessDescription && state) {
      handleResearch();
    }
  }, [isOpen, businessDescription, state]);

  const handleResearch = async () => {
    if (!businessDescription || !state) {
      setError('Business description and state are required');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const results = await researchBusinessLocation(businessDescription, state);
      if (results.length === 0) {
        setError('No suitable locations found. Try adjusting your search criteria.');
      }
      setSuggestions(results);
    } catch (error) {
      setError('Error researching locations');
      console.error('Location research error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLocation = (location: Address) => {
    setSelectedLocation(location);
    onSelectLocation(location);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Location Research
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-gray-600">Researching optimal locations...</span>
                </div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 rounded-md">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {suggestion.address.street1}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {suggestion.address.city}, {suggestion.address.state} {suggestion.address.zipCode}
                        </p>
                        {suggestion.businessPresence && (
                          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                            <Building2 className="w-4 h-4" />
                            <span>Existing business presence</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => onSelectLocation(suggestion.address)}
                        className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                      >
                        Select
                      </button>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Nearby Businesses</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {suggestion.nearbyBusinesses.map((business, i) => (
                            <li key={i}>• {business}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Risk Factors</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {suggestion.riskFactors.map((factor, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}

                {suggestions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No location suggestions found. Try adjusting your search criteria.
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={handleResearch}
              disabled={isLoading}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto"
            >
              Refresh Research
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}