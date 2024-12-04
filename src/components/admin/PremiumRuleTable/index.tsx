import React from 'react';
import { AdminTable } from '../AdminTable';
import { AdminForm } from '../AdminForm';
import { PremiumRuleConfig } from '../../../types/admin';
import { getPremiumRules, savePremiumRule, updatePremiumRule } from '../../../utils/admin';
import { useSupabase } from '../../../contexts/SupabaseContext';
import { states } from '../../../utils/constants';

const ruleTypes = [
  { value: 'discount', label: 'Premium Discount' },
  { value: 'minimum', label: 'Minimum Premium' },
  { value: 'expense', label: 'Expense Constant' },
  { value: 'size', label: 'Size Factor' },
  { value: 'supplemental', label: 'Supplemental Coverage' },
  { value: 'catastrophe', label: 'Catastrophe Loading' }
];

export function PremiumRuleTable() {
  const [rules, setRules] = React.useState<PremiumRuleConfig[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedRule, setSelectedRule] = React.useState<PremiumRuleConfig>();
  const [showForm, setShowForm] = React.useState(false);
  const { user } = useSupabase();

  React.useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const data = await getPremiumRules();
      setRules(data);
    } catch (error) {
      console.error('Error loading premium rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedRule(undefined);
    setShowForm(true);
  };

  const handleEdit = (rule: PremiumRuleConfig) => {
    setSelectedRule(rule);
    setShowForm(true);
  };

  const handleSave = async (data: PremiumRuleConfig) => {
    if (!user) return;

    try {
      if (selectedRule) {
        await updatePremiumRule(data, user);
      } else {
        await savePremiumRule(data, user);
      }
      await loadRules();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving premium rule:', error);
    }
  };

  const columns = [
    { key: 'state_code', header: 'State' },
    { key: 'rule_type', header: 'Rule Type' },
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
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
      key: 'rule_type',
      label: 'Rule Type',
      type: 'select' as const,
      options: ruleTypes,
      required: true
    },
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
        title="Premium Rules"
        columns={columns}
        data={rules}
        onAdd={handleAdd}
        onEdit={handleEdit}
        loading={loading}
      />

      <AdminForm
        title={selectedRule ? 'Edit Premium Rule' : 'Add Premium Rule'}
        fields={fields}
        data={selectedRule || {}}
        onSave={handleSave}
        onClose={() => setShowForm(false)}
        isOpen={showForm}
      />
    </>
  );
}