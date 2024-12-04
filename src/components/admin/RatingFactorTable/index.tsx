import React from 'react';
import { AdminTable } from '../AdminTable';
import { AdminForm } from '../AdminForm';
import { RatingFactor } from '../../../types/admin';
import { getRatingFactors, saveRatingFactor, updateRatingFactor } from '../../../utils/admin';
import { useSupabase } from '../../../contexts/SupabaseContext';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'expired', label: 'Expired' }
];

export function RatingFactorTable() {
  const [factors, setFactors] = React.useState<RatingFactor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedFactor, setSelectedFactor] = React.useState<RatingFactor>();
  const [showForm, setShowForm] = React.useState(false);
  const { user } = useSupabase();

  React.useEffect(() => {
    loadFactors();
  }, []);

  const loadFactors = async () => {
    try {
      const data = await getRatingFactors();
      setFactors(data);
    } catch (error) {
      console.error('Error loading rating factors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedFactor(undefined);
    setShowForm(true);
  };

  const handleEdit = (factor: RatingFactor) => {
    setSelectedFactor(factor);
    setShowForm(true);
  };

  const handleSave = async (data: RatingFactor) => {
    if (!user) return;

    try {
      if (selectedFactor) {
        await updateRatingFactor(data, user);
      } else {
        await saveRatingFactor(data, user);
      }
      await loadFactors();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving rating factor:', error);
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    { key: 'status', header: 'Status' },
    { key: 'version', header: 'Version' },
    { key: 'effective_date', header: 'Effective Date' },
    { key: 'expiration_date', header: 'Expiration Date' }
  ];

  const fields = [
    {
      key: 'name',
      label: 'Name',
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
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: statusOptions,
      required: true
    },
    {
      key: 'version',
      label: 'Version',
      type: 'text' as const,
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
        title="Rating Factors"
        columns={columns}
        data={factors}
        onAdd={handleAdd}
        onEdit={handleEdit}
        loading={loading}
      />

      <AdminForm
        title={selectedFactor ? 'Edit Rating Factor' : 'Add Rating Factor'}
        fields={fields}
        data={selectedFactor || {}}
        onSave={handleSave}
        onClose={() => setShowForm(false)}
        isOpen={showForm}
      />
    </>
  );
}