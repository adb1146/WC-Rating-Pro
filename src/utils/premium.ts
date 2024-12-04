import { PayrollInfo, PremiumModifiers, PremiumBreakdown, RateInfo } from '../types';
import { supabase } from './supabase';

async function getBaseRate(stateCode: string, classCode: string, effectiveDate: string = '2024-01-01'): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('class_codes')
      .select('base_rate')
      .eq('state_code', stateCode)
      .eq('class_code', classCode)
      .eq('effective_date', effectiveDate)
      .single();

    if (error) {
      console.warn(`Base rate not found for ${stateCode}-${classCode}: ${error.message}`);
      return 0;
    }

    return data?.base_rate || 0;
  } catch (error) {
    console.error(`Database error fetching base rate for ${stateCode}-${classCode}:`, error);
    return 0;
  }
}

export function calculateManualPremium(payroll: number, rate: number): number {
  return (payroll / 100) * rate;
}

export async function applyModifiers(
  manualPremium: number,
  modifiers: PremiumModifiers,
  stateCode: string,
  effectiveDate: string = '2024-01-01'
): Promise<number> {
  const { experienceMod, scheduleCredit, safetyCredit } = modifiers;
  let premium = manualPremium;

  try {
    // Get territory multiplier
    const { data: territory } = await supabase
      .from('territories')
      .select('rate_multiplier')
      .eq('state_code', stateCode)
      .eq('effective_date', effectiveDate)
      .single();

    if (territory?.rate_multiplier) {
      premium *= territory.rate_multiplier;
    }

    // Apply experience modification factor
    if (experienceMod) {
      premium *= experienceMod;
    }
    
    // Apply schedule credit/debit
    if (scheduleCredit) {
      premium *= (1 - scheduleCredit);
    }
    
    // Apply safety credit
    if (safetyCredit) {
      premium *= (1 - safetyCredit);
    }
    
    // Add supplemental coverage premiums if selected
    if (modifiers.supplementalCoverages?.length) {
      // Get supplemental coverage rates from database
      const { data: coverages } = await supabase
        .from('premium_rules')
        .select('*')
        .eq('rule_type', 'supplemental')
        .eq('state_code', 'ALL')
        .eq('effective_date', effectiveDate);

      if (coverages) {
        const supplementalPremium = modifiers.supplementalCoverages
          .filter(coverage => coverage.selected)
          .reduce((sum, coverage) => {
            const dbCoverage = coverages.find(c => c.id === coverage.id);
            return sum + (dbCoverage?.parameters?.premium || coverage.premium);
          }, 0);
        premium += supplementalPremium;
      }
    }
    
    return premium;
  } catch (error) {
    console.error('Database error applying modifiers:', error);
    return manualPremium;
  }
}

export async function calculateStatePremium(
  payrollInfo: PayrollInfo[],
  modifiers: PremiumModifiers,
  stateCode: string
): Promise<PremiumBreakdown[]> {
  const results = await Promise.all(payrollInfo
    .filter((info) => info.stateCode === stateCode)
    .map(async (info) => {
      const baseRate = await getBaseRate(info.stateCode, info.classCode);
      const manualPremium = await calculateManualPremium(info.annualPayroll, baseRate);
      const modifiedPremium = await applyModifiers(manualPremium, modifiers);

      return {
        stateCode: info.stateCode,
        classCode: info.classCode,
        payroll: info.annualPayroll,
        baseRate,
        manualPremium,
        modifiedPremium,
        finalPremium: modifiedPremium,
      };
    }));
    
  return results;
}

export function calculateTotalPremium(breakdowns: PremiumBreakdown[]): number {
  return breakdowns.reduce((total, breakdown) => total + breakdown.finalPremium, 0);
}