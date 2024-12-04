import { supabase } from './supabase';
import { RatingFactor, TerritoryConfig, PremiumRuleConfig, ClassCodeConfig } from '../types/admin';
import { User } from '@supabase/supabase-js';

export async function getClassCodes(): Promise<ClassCodeConfig[]> {
  const { data, error } = await supabase
    .from('class_codes')
    .select('*')
    .order('class_code', { ascending: true });

  if (error) {
    console.error('Error fetching class codes:', error);
    throw error;
  }

  return data || [];
}

export async function saveClassCode(classCode: ClassCodeConfig, user: User): Promise<void> {
  const { error } = await supabase
    .from('class_codes')
    .insert([{
      ...classCode,
      created_by: user.id
    }]);

  if (error) {
    console.error('Error saving class code:', error);
    throw error;
  }
}

export async function updateClassCode(classCode: ClassCodeConfig, user: User): Promise<void> {
  const { error } = await supabase
    .from('class_codes')
    .update({
      ...classCode,
      created_by: user.id
    })
    .eq('id', classCode.id);

  if (error) {
    console.error('Error updating class code:', error);
    throw error;
  }
}

export async function getRatingFactors(): Promise<RatingFactor[]> {
  const { data, error } = await supabase
    .from('rating_factors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching rating factors:', error);
    throw error;
  }

  return data || [];
}

export async function saveRatingFactor(factor: RatingFactor, user: User): Promise<void> {
  const { error } = await supabase
    .from('rating_factors')
    .insert([{
      ...factor,
      created_by: user.id
    }]);

  if (error) {
    console.error('Error saving rating factor:', error);
    throw error;
  }
}

export async function updateRatingFactor(factor: RatingFactor, user: User): Promise<void> {
  const { error } = await supabase
    .from('rating_factors')
    .update({
      ...factor,
      created_by: user.id
    })
    .eq('id', factor.id);

  if (error) {
    console.error('Error updating rating factor:', error);
    throw error;
  }
}

export async function getTerritories(): Promise<TerritoryConfig[]> {
  const { data, error } = await supabase
    .from('territories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching territories:', error);
    throw error;
  }

  return data || [];
}

export async function saveTerritory(territory: TerritoryConfig, user: User): Promise<void> {
  const { error } = await supabase
    .from('territories')
    .insert([{
      ...territory,
      created_by: user.id
    }]);

  if (error) {
    console.error('Error saving territory:', error);
    throw error;
  }
}

export async function updateTerritory(territory: TerritoryConfig, user: User): Promise<void> {
  const { error } = await supabase
    .from('territories')
    .update({
      ...territory,
      created_by: user.id
    })
    .eq('id', territory.id);

  if (error) {
    console.error('Error updating territory:', error);
    throw error;
  }
}

export async function getPremiumRules(): Promise<PremiumRuleConfig[]> {
  const { data, error } = await supabase
    .from('premium_rules')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching premium rules:', error);
    throw error;
  }

  return data || [];
}

export async function savePremiumRule(rule: PremiumRuleConfig, user: User): Promise<void> {
  const { error } = await supabase
    .from('premium_rules')
    .insert([{
      ...rule,
      created_by: user.id
    }]);

  if (error) {
    console.error('Error saving premium rule:', error);
    throw error;
  }
}

export async function updatePremiumRule(rule: PremiumRuleConfig, user: User): Promise<void> {
  const { error } = await supabase
    .from('premium_rules')
    .update({
      ...rule,
      created_by: user.id
    })
    .eq('id', rule.id);

  if (error) {
    console.error('Error updating premium rule:', error);
    throw error;
  }
}

export async function logAuditEvent(event: {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, any>;
}): Promise<void> {
  const { error } = await supabase
    .from('audit_logs')
    .insert([event]);

  if (error) {
    console.error('Error logging audit event:', error);
    throw error;
  }
}

export async function getAuditLogs(): Promise<any[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }

  return data || [];
}