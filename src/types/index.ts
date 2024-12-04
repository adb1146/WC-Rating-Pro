// Common Types
export type EntityType = 'sole_proprietorship' | 'partnership' | 'corporation' | 'llc' | 'other';

export interface SafetyProgram {
  name: string;
  implementationDate: string;
  lastReviewDate: string;
  description: string;
  status: 'active' | 'under_review' | 'planned';
}

export interface RiskControl {
  hazardType: string;
  controlMeasures: string;
  lastAssessmentDate: string;
  responsiblePerson: string;
  effectiveness: 'high' | 'medium' | 'low';
}

export interface SubcontractorInfo {
  name: string;
  workType: string;
  certificateExpiration: string;
  annualCost: number;
  employeeCount: number;
}

export interface WorkforceMetrics {
  turnoverRate: number;
  avgTenure: number;
  trainingHoursPerYear: number;
  remoteWorkPercentage: number;
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PriorInsurance {
  carrier: string;
  policyNumber: string;
  effectiveDate: string;
  expirationDate: string;
  premiumAmount: number;
}

export interface LossHistory {
  date: string;
  type: string;
  description: string;
  amount: number;
  status: 'open' | 'closed';
  claimNumber: string;
}

export interface PayrollInfo {
  stateCode: string;
  classCode: string;
  employeeCount: number;
  annualPayroll: number;
  jobDescription: string;
}

export interface RateInfo {
  stateCode: string;
  classCode: string;
  baseRate: number;
}

export interface PremiumModifiers {
  experienceMod: number;
  scheduleCredit: number;
  safetyCredit: number;
  supplementalCoverages: SupplementalCoverage[];
}

export interface SupplementalCoverage {
  id: string;
  name: string;
  description: string;
  premium: number;
  selected: boolean;
  required: boolean;
  limits?: {
    perOccurrence: number;
    aggregate: number;
  };
}

export interface PremiumBreakdown {
  stateCode: string;
  classCode: string;
  payroll: number;
  baseRate: number;
  manualPremium: number;
  modifiedPremium: number;
  finalPremium: number;
}

export interface RatingFactor {
  id: string;
  name: string;
  description: string;
  effectiveDate: string;
  expirationDate: string;
  status: 'active' | 'pending' | 'expired';
  version: string;
}

export interface BusinessInfo {
  name: string;
  entityType: EntityType;
  fein: string;
  yearsInBusiness: number;
  description: string;
  locations: Address[];
  contactEmail: string;
  contactPhone: string;
  safetyPrograms: SafetyProgram[];
  riskControls: RiskControl[];
  subcontractors: SubcontractorInfo[];
  workforceMetrics: WorkforceMetrics;
  priorInsurance: PriorInsurance[];
  lossHistory: LossHistory[];
  payrollInfo: PayrollInfo[];
  modifiers: PremiumModifiers;
}

export interface SavedRating {
  id: string;
  businessInfo: BusinessInfo;
  savedAt: string;
  totalPremium: number;
  status: 'draft' | 'submitted' | 'approved' | 'declined';
}

export interface Quote {
  id: string;
  ratingId: string;
  quoteNumber: string;
  businessInfo: BusinessInfo;
  premium: number;
  effectiveDate: string;
  expirationDate: string;
  status: 'draft' | 'issued' | 'bound' | 'expired';
  createdAt: string;
  issuedAt?: string;
  boundAt?: string;
  notes?: string;
}