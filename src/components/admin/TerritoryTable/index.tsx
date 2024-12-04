import React from 'react';
import { AdminTable } from '../AdminTable';
import { AdminForm } from '../AdminForm';
import { TerritoryConfig } from '../../../types/admin';
import { getTerritories, saveTerritory, updateTerritory } from '../../../utils/admin';
import { useSupabase } from '../../../contexts/SupabaseContext';
import { states } from '../../../utils/constants';

export function TerritoryTable() {
  const [territories, setTerritories] = React.useState<TerritoryConfig[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedTerritory, setSelectedTerritory] = React.useState<TerritoryConfig>();
  const [showForm, setShowForm] = React.useState(false);
  const { user } = useSupabase();

  React.useEffect(() => {
    loadTerritories();
  }, []);

  const loadTerritories = async () => {
    try {
      const data = await getTerritories();
      setTerritories(data);
    } catch (error) {
      console.error('Error loading territories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedTerritory(undefined);
    setShowForm(true);
  };

  const handleEdit = (territory: TerritoryConfig) => {
    setSelectedTerritory(territory);
    setShowForm(true);
  };

  const handleSave = async (data: TerritoryConfig) => {
    if (!user) return;

    try {
      if (selectedTerritory) {
        await updateTerritory(data, user);
      } else {
        await saveTerritory(data, user);
      }
      await loadTerritories();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving territory:', error);
    }
  };

  const columns = [
    { key: 'state_code', header: 'State' },
    { key: 'territory_code', header: 'Territory Code' },
    { key: 'description', header: 'Description' },
    { key: 'rate_multiplier', header: 'Rate Multiplier' },
    { key: 'effective_date', header: 'Effective Date' },
    { key: 'expiration_date', header: 'Expiration Date' }
  ];

  const fields = [
    {
      key: 'state_code',
      label: 'State',
      type: 'select' as const,
      options: states.map(state => ({ value: state.code, label: state.name })),
      required: true
    },
    {
      key: 'territory_code',
      label: 'Territory Code',
      type: 'text' as const,
      required: true
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea' as const,
      required: true
    },
    {
      key: 'rate_multiplier',
      label: 'Rate Multiplier',
      type: 'number' as const,
      required: true
    },
    {
      key: 'effective_date',
      label: 'Effective Date',
      type: 'date' as const,
      required: true
    },
    {
      key: 'expiration_date',
      label: 'Expiration Date',
      type: 'date' as const,
      required: true
    }
  ];

  return (
    <>
      <AdminTable
        title="Territories"
        columns={columns}
        data={territories}
        onAdd={handleAdd}
        onEdit={handleEdit}
        loading={loading}
      />

      <AdminForm
        title={selectedTerritory ? 'Edit Territory' : 'Add Territory'}
        fields={fields}
        data={selectedTerritory || {}}
        onSave={handleSave}
        onClose={() => setShowForm(false)}
        isOpen={showForm}
      />
    </>
  );
}