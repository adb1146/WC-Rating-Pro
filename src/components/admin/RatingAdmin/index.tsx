import React from 'react';
import { Settings, Search, Download, Upload, History, Plus, AlertCircle } from 'lucide-react';
import { RatingFactorTable } from '../RatingFactorTable';
import { ClassCodeTable } from '../ClassCodeTable';
import { TerritoryTable } from '../TerritoryTable';
import { PremiumRuleTable } from '../PremiumRuleTable';
import { RatingSearch } from '../RatingSearch';
import { RatingHistory } from '../RatingHistory';
import { UserManagement } from '../UserManagement';
import { useAuth } from '../../../contexts/AuthContext';
import { useSupabase } from '../../../contexts/SupabaseContext';
import { supabase } from '../../../utils/supabase';

interface RatingAdminProps {
  onClose: () => void;
}

type AdminTab = 'rating_factors' | 'class_codes' | 'territories' | 'rules' | 'users';

interface AdminOperation {
  table: string;
  action: 'create' | 'update' | 'delete';
  data?: any;
  id?: string;
}

interface AdminError {
  message: string;
  timeout?: number;
}

export function RatingAdmin({ onClose }: RatingAdminProps) {
  const [activeTab, setActiveTab] = React.useState<AdminTab>('rating_factors');
  const [searchQuery, setSearchQuery] = React.useState('');
  const { hasPermission } = useAuth();
  const { user } = useSupabase();
  const [error, setError] = React.useState<AdminError>();
  const [isLoading, setIsLoading] = React.useState(false);
  const errorTimeoutRef = React.useRef<number>();
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  React.useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const handleOperation = async ({ table, action, data, id }: AdminOperation) => {
    if (!user) {
      handleError('User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      let result;
      
      switch (action) {
        case 'create':
          result = await supabase
            .from(table)
            .insert([{ ...data, created_by: user.id }]);
          break;
          
        case 'update':
          if (!id) throw new Error('ID required for update');
          result = await supabase
            .from(table)
            .update({ ...data, updated_by: user.id })
            .eq('id', id);
          break;
          
        case 'delete':
          if (!id) throw new Error('ID required for delete');
          // Check if record can be safely deleted
          const { data: record } = await supabase
            .from(table)
            .select('is_system_required')
            .eq('id', id)
            .single();
            
          if (record?.is_system_required) {
            throw new Error('Cannot delete system-required record');
          }
          
          result = await supabase
            .from(table)
            .delete()
            .eq('id', id);
          break;
      }

      if (result?.error) throw result.error;
      
      // Trigger refresh of data
      setRefreshTrigger(prev => prev + 1);
      
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleError = (error: any, timeout = 5000) => {
    console.error('Admin operation error:', error);
    setError({
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      timeout
    });

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    if (timeout > 0) {
      errorTimeoutRef.current = window.setTimeout(() => {
        setError(undefined);
      }, timeout);
    }
  };

  const tabs = [
    {
      id: 'rating_factors' as const,
      label: 'Rating Factors',
      description: 'Manage experience mods, schedule credits, and other rating factors',
      permission: 'view_rates'
    },
    {
      id: 'class_codes' as const,
      label: 'Class Codes',
      description: 'Manage workers compensation class codes and base rates',
      permission: 'manage_class_codes'
    },
    {
      id: 'territories' as const,
      label: 'Territories',
      description: 'Manage territory definitions and rate multipliers',
      permission: 'manage_territories'
    },
    {
      id: 'rules' as const,
      label: 'Premium Rules',
      description: 'Configure premium calculation rules and factors',
      permission: 'manage_rules'
    },
    {
      id: 'users' as const,
      label: 'User Management',
      description: 'Manage user accounts and permissions',
      permission: 'manage_users'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Rating Administration
              </h1> 
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                <History className="w-4 h-4" />
                History
              </button>
              <button
                onClick={() => {
                  const list = document.querySelector('[data-testid="rating-factor-list"]');
                  if (list) {
                    const event = new CustomEvent('add-new');
                    list.dispatchEvent(event);
                  }
                }}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md"
              >
                Back to Rating
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error.message}</p>
            </div>
          )}

          <div className="flex gap-4 border-b border-gray-200 pb-4">
            {tabs.map(tab => (
              hasPermission(tab.permission) && (
                <div key={tab.id} className="relative group">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                  <div className="absolute left-0 w-64 p-2 mt-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {tab.description}
                  </div>
                </div>
              )
            ))}
          </div>
          
          {activeTab !== 'users' && searchQuery !== undefined && (
            <div className="flex justify-end">
              <RatingSearch value={searchQuery} onChange={setSearchQuery} />
            </div>
          )}

          <div className="bg-white rounded-lg shadow mt-6">
            {activeTab === 'users' ? (
              <UserManagement />
            ) : activeTab === 'territories' ? (
              <TerritoryTable 
                onError={handleError}
                tableWidth="100%"
                canEdit={hasPermission('edit_rates')}
                canDelete={hasPermission('delete_rates')}
                isDeletable={(territory) => !territory.is_system_required}
                onAdd={(data) => handleOperation({ table: 'territories', action: 'create', data })}
                onEdit={(data) => handleOperation({ table: 'territories', action: 'update', data, id: data.id })}
                onDelete={(data) => handleOperation({ table: 'territories', action: 'delete', id: data.id })}
                refreshTrigger={refreshTrigger}
              />
            ) : activeTab === 'rules' ? (
              <PremiumRuleTable
                onError={handleError}
                tableWidth="100%"
                canEdit={hasPermission('edit_rates')}
                canDelete={hasPermission('delete_rates')}
                isDeletable={(rule) => !rule.is_system_required}
                onAdd={(data) => handleOperation({ table: 'premium_rules', action: 'create', data })}
                onEdit={(data) => handleOperation({ table: 'premium_rules', action: 'update', data, id: data.id })}
                onDelete={(data) => handleOperation({ table: 'premium_rules', action: 'delete', id: data.id })}
                refreshTrigger={refreshTrigger}
              />
            ) : activeTab === 'rating_factors' ? (
              <RatingFactorTable
                onError={handleError}
                tableWidth="100%"
                canEdit={hasPermission('edit_rates')}
                canDelete={hasPermission('delete_rates')}
                isDeletable={(factor) => !factor.is_system_required}
                onAdd={(data) => handleOperation({ table: 'rating_factors', action: 'create', data })}
                onEdit={(data) => handleOperation({ table: 'rating_factors', action: 'update', data, id: data.id })}
                onDelete={(data) => handleOperation({ table: 'rating_factors', action: 'delete', id: data.id })}
                refreshTrigger={refreshTrigger}
              />
            ) : activeTab === 'class_codes' ? (
              <ClassCodeTable
                onError={handleError}
                tableWidth="100%"
                canEdit={hasPermission('edit_rates')}
                canDelete={hasPermission('delete_rates')}
                isDeletable={(code) => !code.is_system_required}
                onAdd={(data) => handleOperation({ table: 'class_codes', action: 'create', data })}
                onEdit={(data) => handleOperation({ table: 'class_codes', action: 'update', data, id: data.id })}
                onDelete={(data) => handleOperation({ table: 'class_codes', action: 'delete', id: data.id })}
                refreshTrigger={refreshTrigger}
              />
            ) : null}
          </div>

          {activeTab !== 'users' && (
            <div className="mt-8">
              <RatingHistory />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}