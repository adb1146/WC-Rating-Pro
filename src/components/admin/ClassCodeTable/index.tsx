import React from 'react';
import { AdminTable } from '../AdminTable';
import { AdminForm } from '../AdminForm';
import { ClassCodeConfig } from '../../../types/admin';
import { getClassCodes, saveClassCode, updateClassCode } from '../../../utils/admin';
import { useSupabase } from '../../../contexts/SupabaseContext';
import { states } from '../../../utils/constants';

const hazardGroups = [
  { value: 'A', label: 'Group A - Low Risk' },
  { value: 'B', label: 'Group B - Moderate Risk' },
  { value: 'C', label: 'Group C - Medium Risk' },
  { value: 'D', label: 'Group D - High Risk' }
];

const industryGroups = [
  { value: 'Professional Services', label: 'Professional Services' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Food Service', label: 'Food Service' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Real Estate', label: 'Real Estate' }
];

export function ClassCodeTable() {
  const [classCodes, setClassCodes] = React.useState<ClassCodeConfig[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedClassCode, setSelectedClassCode] = React.useState<ClassCodeConfig>();
  const [showForm, setShowForm] = React.useState(false);
  const { user } = useSupabase();

  React.useEffect(() => {
    loadClassCodes();
  }, []);

  const loadClassCodes = async () => {
    try {
      const codes = await getClassCodes();
      setClassCodes(codes);
    } catch (error) {
      console.error('Error loading class codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedClassCode(undefined);
    setShowForm(true);
  };

  const handleEdit = (classCode: ClassCodeConfig) => {
    setSelectedClassCode(classCode);
    setShowForm(true);
  };

  const handleSave = async (data: ClassCodeConfig) => {
    if (!user) return;

    try {
      if (selectedClassCode) {
        await updateClassCode(data, user);
      } else {
        await saveClassCode(data, user);
      }
      await loadClassCodes();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving class code:', error);
    }
  };

  const columns = [
    { key: 'state_code', header: 'State' },
    { key: 'class_code', header: 'Class Code' },
    { key: 'description', header: 'Description' },
    { key: 'base_rate', header: 'Base Rate' },
    { key: 'hazard_group', header: 'Hazard Group' },
    { key: 'industry_group', header: 'Industry Group' },
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
      key: 'class_code',
      label: 'Class Code',
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
      key: 'base_rate',
      label: 'Base Rate',
      type: 'number' as const,
      required: true
    },
    {
      key: 'hazard_group',
      label: 'Hazard Group',
      type: 'select' as const,
      options: hazardGroups,
      required: true
    },
    {
      key: 'industry_group',
      label: 'Industry Group',
      type: 'select' as const,
      options: industryGroups,
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
        title="Class Codes"
        columns={columns}
        data={classCodes}
        onAdd={handleAdd}
        onEdit={handleEdit}
        loading={loading}
      />

      <AdminForm
        title={selectedClassCode ? 'Edit Class Code' : 'Add Class Code'}
        fields={fields}
        data={selectedClassCode || {}}
        onSave={handleSave}
        onClose={() => setShowForm(false)}
        isOpen={showForm}
      />
    </>
  );
}