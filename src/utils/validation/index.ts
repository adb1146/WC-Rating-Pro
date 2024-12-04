import { BusinessInfo } from '../../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export function validateBusinessInfo(data: BusinessInfo): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Business Information
  if (!data.name) errors.push('Business name is required');
  if (!data.fein) errors.push('FEIN is required');
  if (!data.description) errors.push('Business description is required');
  if (!data.contactEmail) errors.push('Contact email is required');
  if (!data.contactPhone) errors.push('Contact phone is required');

  // Locations
  if (data.locations.length === 0) {
    errors.push('At least one business location is required');
  } else {
    data.locations.forEach((location, index) => {
      if (!location.street1 || !location.city || !location.state || !location.zipCode) {
        errors.push(`Location ${index + 1} has incomplete address information`);
      }
    });
  }

  // Prior Insurance
  if (data.priorInsurance.length === 0) {
    warnings.push('Prior insurance information is recommended');
  }

  // Payroll Information
  if (data.payrollInfo.length === 0) {
    errors.push('At least one payroll classification is required');
  } else {
    data.payrollInfo.forEach((info, index) => {
      if (!info.stateCode || !info.classCode || !info.annualPayroll) {
        errors.push(`Payroll classification ${index + 1} has incomplete information`);
      }
    });
  }

  // Safety Programs
  if (data.safetyPrograms.length === 0) {
    warnings.push('Safety programs are recommended for better rates');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}