import { PayrollInfo } from '../../types';
import { supabase } from '../supabase';

interface ClassCodeRate {
  baseRate: number;
  hazardGroup: string;
  industryGroup: string;
  limitedLosses?: boolean;
}

export async function getClassCodeRate(
  stateCode: string,
  classCode: string,
  effectiveDate: string = '2024-01-01'
): Promise<ClassCodeRate> {
  try {
    const { data, error } = await supabase
      .from('class_codes')
      .select('*')
      .eq('state_code', stateCode)
      .eq('class_code', classCode)
      .eq('effective_date', effectiveDate)
      .single();

    if (error) throw error;

    return {
      baseRate: data.base_rate,
      hazardGroup: data.hazard_group,
      industryGroup: data.industry_group,
      limitedLosses: data.limited_losses
    };
  } catch (error) {
    console.error(`Error getting class code rate for ${stateCode}-${classCode}:`, error);
    // Return safe default values
    return {
      baseRate: 0,
      hazardGroup: 'A',
      industryGroup: 'Unknown',
      limitedLosses: false
    };
  }
}

export async function validatePayrollClassifications(
  payrollInfo: PayrollInfo[]
): Promise<{
  isValid: boolean;
  errors: string[];
  suggestions: string[];
}> {
  const result = {
    isValid: true,
    errors: [] as string[],
    suggestions: [] as string[]
  };

  for (const info of payrollInfo) {
    try {
      // Verify class code exists
      const { data: classCode, error } = await supabase
        .from('class_codes')
        .select('*')
        .eq('state_code', info.stateCode)
        .eq('class_code', info.classCode)
        .single();

      if (error || !classCode) {
        result.isValid = false;
        result.errors.push(`Invalid class code ${info.classCode} for state ${info.stateCode}`);
        continue;
      }

      // Check for standard exceptions
      if (classCode.governing_class && info.employeeCount < 3) {
        result.suggestions.push(
          `Consider using standard exception codes for small employee counts in class ${info.classCode}`
        );
      }

      // Validate payroll reasonableness
      const avgPayroll = info.annualPayroll / info.employeeCount;
      if (avgPayroll < 20000 || avgPayroll > 200000) {
        result.suggestions.push(
          `Average payroll of ${avgPayroll.toFixed(2)} for class ${info.classCode} seems unusual`
        );
      }
    } catch (error) {
      console.error('Payroll validation error:', error);
      result.errors.push(`Error validating class code ${info.classCode}`);
    }
  }

  return result;
}