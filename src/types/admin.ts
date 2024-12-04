export type UserRole = 'admin' | 'manager' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
}

export type Permission = 
  | 'view_rates'
  | 'edit_rates'
  | 'delete_rates'
  | 'manage_territories'
  | 'manage_class_codes'
  | 'manage_rules'
  | 'manage_users'
  | 'view_history'
  | 'export_data'
  | 'import_data';

export interface TerritoryConfig {
  id: string;
  stateCode: string;
  territoryCode: string;
  description: string;
  rateMultiplier: number;
  effectiveDate: string;
  expirationDate: string;
}

export interface ClassCodeConfig {
  id: string;
  stateCode: string;
  classCode: string;
  description: string;
  baseRate: number;
  hazardGroup: string;
  effectiveDate: string;
  expirationDate: string;
  crosswalkCodes: Array<{
    stateCode: string;
    classCode: string;
  }>;
}

export interface PremiumRuleConfig {
  id: string;
  stateCode: string;
  ruleType: 'discount' | 'minimum' | 'expense' | 'size' | 'supplemental' | 'catastrophe';
  name: string;
  description: string;
  parameters: {
    ranges?: Array<{
      min: number;
      max: number;
      factor: number;
    }>;
    flatAmount?: number;
    percentage?: number;
    premium?: number;
    limits?: {
      perOccurrence: number;
      aggregate: number;
    };
  };
  effectiveDate: string;
  expirationDate: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  entityType: 'rating_factor' | 'rating_table' | 'user';
  entityId: string;
  timestamp: string;
  changes: Record<string, any>;
}