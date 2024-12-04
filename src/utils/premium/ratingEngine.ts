import { BusinessInfo, PremiumBreakdown } from '../../types';
import { calculateExperienceMod, calculateScheduleCredit } from './modCalculator';
import { getTerritoryRate } from './territoryRater';
import { getClassCodeRate, validatePayrollClassifications } from './classCodeRater';
import { calculateRiskScore } from '../ai/riskScoring';
import { analyzePremiumOptimizations } from '../ai/premiumOptimization';

export async function calculatePremium(data: BusinessInfo): Promise<{
  breakdowns: PremiumBreakdown[];
  riskScore: number;
  optimizations: string[];
}> {
  // Calculate risk score
  const riskScore = calculateRiskScore(data);

  // Get territory rates for all locations
  const territoryRates = await Promise.all(
    data.locations.map(location => getTerritoryRate(location))
  );

  // Calculate state premiums
  const breakdowns: PremiumBreakdown[] = [];
  for (const payroll of data.payrollInfo) {
    const classCodeRate = await getClassCodeRate(
      payroll.stateCode,
      payroll.classCode
    );

    const territoryRate = territoryRates.find(t => 
      t.territoryCode.startsWith(payroll.stateCode)
    );

    const manualPremium = (payroll.annualPayroll / 100) * classCodeRate.baseRate;
    const territoryAdjusted = manualPremium * (territoryRate?.rateMultiplier || 1.0);

    // Apply experience mod
    const expMod = calculateExperienceMod(
      data.lossHistory,
      manualPremium * 0.05, // Expected losses
      payroll.annualPayroll
    );

    // Calculate schedule credits
    const scheduleCredit = calculateScheduleCredit(
      data.workforceMetrics,
      data.safetyPrograms,
      data.yearsInBusiness
    );

    const finalPremium = territoryAdjusted * expMod * (1 - scheduleCredit);

    breakdowns.push({
      stateCode: payroll.stateCode,
      classCode: payroll.classCode,
      payroll: payroll.annualPayroll,
      baseRate: classCodeRate.baseRate,
      manualPremium,
      modifiedPremium: territoryAdjusted * expMod,
      finalPremium
    });
  }

  // Get premium optimization suggestions
  const optimizations = await analyzePremiumOptimizations(
    data,
    breakdowns.reduce((sum, b) => sum + b.finalPremium, 0),
    breakdowns
  );

  return {
    breakdowns,
    riskScore: riskScore.total,
    optimizations: optimizations.suggestions.map(s => s.description)
  };
}