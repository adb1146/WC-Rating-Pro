import React from 'react';
import { MapPin, Plus, Trash2, Brain, Loader2, CheckCircle, Search } from 'lucide-react';
import { Address } from '../../types';
import { states } from '../../utils/constants';
import { ValidationMessage } from '../ValidationMessage';
import { suggestLocation, validateAddress } from '../../utils/ai/locationAssistant';
import { getAddressSuggestions, formatAddress } from '../../utils/ai/locationTypeahead';
import { useDebounce } from '../../utils/hooks';

interface LocationFormProps {
  locations: Address[];
  onChange: (locations: Address[]) => void;
}

const emptyLocation: Address = {
  street1: '',
  street2: '',
  city: '',
  state: '',
  zipCode: '',
};

export function LocationForm({ locations, onChange }: LocationFormProps) {
  const [suggestions, setSuggestions] = React.useState<Address[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [typeaheadSuggestions, setTypeaheadSuggestions] = React.useState<Address[]>([]);
  const [activeTypeaheadIndex, setActiveTypeaheadIndex] = React.useState<number>(-1);
  const [showTypeahead, setShowTypeahead] = React.useState<{[key: number]: boolean}>({});
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const typeaheadRef = React.useRef<HTMLDivElement>(null);

  const handleAddLocation = () => {
    onChange([...locations, { ...emptyLocation }]);
  };

  const handleRemoveLocation = (index: number) => {
    onChange(locations.filter((_, i) => i !== index));
  };

  const handleLocationChange = (index: number, field: keyof Address, value: string) => {
    setValidationErrors([]);
    setSuggestions([]);

    if (field === 'street1') {
      setShowTypeahead(prev => ({ ...prev, [index]: true }));
      setActiveTypeaheadIndex(-1);
      debouncedGetSuggestions(value, index);
    } else {
      setShowTypeahead(prev => ({ ...prev, [index]: false }));
    }

    const updatedLocations = locations.map((location, i) => {
      if (i === index) {
        return { ...location, [field]: value };
      }
      return location;
    });
    onChange(updatedLocations);
  };

  const debouncedGetSuggestions = useDebounce(async (value: string, index: number) => {
    if (!value || value.length < 3) {
      setTypeaheadSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const location = locations[index];
      const suggestions = await getAddressSuggestions(value, location.state);
      setTypeaheadSuggestions(suggestions);
    } catch (error) {
      console.error('Error getting typeahead suggestions:', error);
      setTypeaheadSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeaheadRef.current && !typeaheadRef.current.contains(e.target as Node)) {
        setShowTypeahead({});
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (!showTypeahead[index]) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveTypeaheadIndex(prev => 
          prev < typeaheadSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveTypeaheadIndex(prev => prev > -1 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeTypeaheadIndex >= 0 && typeaheadSuggestions[activeTypeaheadIndex]) {
          handleApplySuggestion(index, typeaheadSuggestions[activeTypeaheadIndex]);
          setShowTypeahead(prev => ({ ...prev, [index]: false }));
        }
        break;
      case 'Escape':
        setShowTypeahead(prev => ({ ...prev, [index]: false }));
        break;
    }
  };

  const handleGetSuggestions = async (index: number) => {
    setIsLoading(true);
    try {
      const location = locations[index];
      const locationSuggestions = await suggestLocation(location);
      setSuggestions(locationSuggestions.map(s => s.address));
    } catch (error) {
      console.error('Error getting location suggestions:', error);
    }
    setIsLoading(false);
  };

  const handleApplySuggestion = (index: number, suggestion: Address) => {
    const updatedLocations = locations.map((location, i) => 
      i === index ? suggestion : location
    );
    onChange(updatedLocations);
    setSuggestions([]);
  };

  const handleValidateLocation = async (index: number) => {
    setIsLoading(true);
    try {
      const location = locations[index];
      const validation = await validateAddress(location);
      if (!validation.isValid) {
        setValidationErrors(validation.errors || []);
        if (validation.suggestions) {
          setSuggestions(validation.suggestions);
        }
      } else {
        setValidationErrors([]);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error validating location:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Business Locations</h2>
        </div>
        {locations.length === 0 && (
          <ValidationMessage message="At least one business location is required" />
        )}
        <button
          type="button"
          onClick={handleAddLocation}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Location
        </button>
      </div>

      <div className="space-y-6">
        {locations.map((location, index) => (
          <div key={index} className="relative border border-gray-200 rounded-lg p-4">
            <button
              type="button"
              onClick={() => handleRemoveLocation(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors z-10"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="absolute top-4 right-12 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleValidateLocation(index)}
                className="text-gray-400 hover:text-blue-500 transition-colors"
                title="Validate Address"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleGetSuggestions(index)}
                disabled={isLoading}
                className="text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
                title="Get AI Suggestions"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={location.street1}
                  onChange={(e) => {
                    handleLocationChange(index, 'street1', e.target.value);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (location.street1) {
                      setShowTypeahead(prev => ({ ...prev, [index]: true }));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main St"
                />
                {showTypeahead[index] && (
                  <div 
                    ref={typeaheadRef}
                    className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200"
                  >
                    {isLoading && (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        <Loader2 className="w-4 h-4 inline-block mr-1 animate-spin" />
                        Loading suggestions...
                      </div>
                    )}
                    {!isLoading && typeaheadSuggestions.length > 0 && (
                    <ul className="py-1 max-h-60 overflow-auto">
                      {typeaheadSuggestions.map((suggestion, i) => (
                        <li
                          key={i}
                          className={`px-3 py-2 cursor-pointer text-sm ${
                            i === activeTypeaheadIndex ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            handleApplySuggestion(index, suggestion);
                            setShowTypeahead(prev => ({ ...prev, [index]: false }));
                          }}
                        >
                          <div className="font-medium">{suggestion.street1}</div>
                          <div className="text-gray-500">
                            {formatAddress({
                              city: suggestion.city,
                              state: suggestion.state,
                              zipCode: suggestion.zipCode
                            })}
                          </div>
                        </li>
                      ))}
                    </ul>
                    )}
                    {!isLoading && typeaheadSuggestions.length === 0 && location.street1.length >= 3 && (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        <Search className="w-4 h-4 inline-block mr-1" />
                        No suggestions found
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Suite/Unit (Optional)
                </label>
                <input
                  type="text"
                  value={location.street2 || ''}
                  onChange={(e) => handleLocationChange(index, 'street2', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Suite 100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={location.city}
                  onChange={(e) => handleLocationChange(index, 'city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <select
                    value={location.state}
                    onChange={(e) => handleLocationChange(index, 'state', e.target.value)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={location.zipCode}
                    onChange={(e) => handleLocationChange(index, 'zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12345"
                    maxLength={5}
                  />
                </div>
              </div>
            </div>
            
            {validationErrors.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <div className="text-sm text-red-700">
                  {validationErrors.map((error, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-900 mb-2">
                  Suggested Addresses:
                </div>
                <div className="space-y-2">
                  {suggestions.map((suggestion, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="text-sm text-blue-700">
                        {suggestion.street1}
                        {suggestion.street2 && <>, {suggestion.street2}</>}
                        <br />
                        {suggestion.city}, {suggestion.state} {suggestion.zipCode}
                      </div>
                      <button
                        onClick={() => handleApplySuggestion(index, suggestion)}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {locations.length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No locations added yet.</p>
            <button
              type="button"
              onClick={handleAddLocation}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first location
            </button>
          </div>
        )}
      </div>
    </div>
  );
}