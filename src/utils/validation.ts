import { BusinessInfo } from '../types';
import { RatingFactor } from '../types/admin';

export function validateBusinessInfo(data: BusinessInfo): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

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
    errors.push('Prior insurance information is required');
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

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateImportData(data: any[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(data)) {
    errors.push('Invalid data format: Expected an array');
    return { isValid: false, errors };
  }

  data.forEach((item, index) => {
    if (!item.name) {
      errors.push(`Row ${index + 1}: Missing name`);
    }
    if (!item.effectiveDate) {
      errors.push(`Row ${index + 1}: Missing effective date`);
    }
    if (!item.expirationDate) {
      errors.push(`Row ${index + 1}: Missing expiration date`);
    }
    if (!item.version) {
      errors.push(`Row ${index + 1}: Missing version`);
    }
    if (item.status && !['active', 'pending', 'expired'].includes(item.status)) {
      errors.push(`Row ${index + 1}: Invalid status value`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

export async function validateBusinessDescription(description: string): Promise<{ suggestions: string[] }> {
  // Simulated validation response
  return {
    suggestions: [
      'Consider adding more details about your safety protocols',
      'Specify any specialized equipment or processes',
      'Include information about employee training programs'
    ]
  };
}