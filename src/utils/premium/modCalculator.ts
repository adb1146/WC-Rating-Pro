import { LossHistory, WorkforceMetrics, SafetyProgram } from '../../types';

interface ModFactors {
  primaryWeight: number;
  excessWeight: number;
  expectedLosses: number;
  actualPrimaryLosses: number;
  actualExcessLosses: number;
  ballast: number;
  weighting: number;
}

export function calculateExperienceMod(
  lossHistory: LossHistory[],
  expectedAnnualLosses: number,
  payroll: number
): number {
  const factors = calculateModFactors(lossHistory, expectedAnnualLosses, payroll);
  
  const actualRatio = (
    (factors.actualPrimaryLosses * factors.primaryWeight) +
    (factors.actualExcessLosses * factors.excessWeight)
  ) / (
    (factors.expectedLosses * factors.primaryWeight * factors.weighting) +
    (factors.ballast)
  );

  // Apply credibility and rounding
  const credibility = calculateCredibility(payroll);
  const mod = 1 + ((actualRatio - 1) * credibility);
  
  // Round to 2 decimal places and constrain between 0.75 and 2.00
  return Math.min(2.00, Math.max(0.75, Math.round(mod * 100) / 100));
}

function calculateModFactors(
  lossHistory: LossHistory[],
  expectedAnnualLosses: number,
  payroll: number
): ModFactors {
  // Calculate actual losses split between primary and excess
  const { primaryLosses, excessLosses } = splitLosses(lossHistory);
  
  // Calculate weighting based on credibility
  const credibility = calculateCredibility(payroll);
  
  return {
    primaryWeight: 0.20,
    excessWeight: 0.10,
    expectedLosses: expectedAnnualLosses,
    actualPrimaryLosses: primaryLosses,
    actualExcessLosses: excessLosses,
    ballast: expectedAnnualLosses * 0.05,
    weighting: credibility
  };
}

function splitLosses(lossHistory: LossHistory[]): { primaryLosses: number; excessLosses: number } {
  const PRIMARY_LOSS_LIMIT = 15000;
  
  let primaryLosses = 0;
  let excessLosses = 0;
  
  lossHistory.forEach(loss => {
    if (loss.amount <= PRIMARY_LOSS_LIMIT) {
      primaryLosses += loss.amount;
    } else {
      primaryLosses += PRIMARY_LOSS_LIMIT;
      excessLosses += loss.amount - PRIMARY_LOSS_LIMIT;
    }
  });
  
  return { primaryLosses, excessLosses };
}

function calculateCredibility(payroll: number): number {
  // Credibility increases with payroll size
  const FULL_CREDIBILITY_PAYROLL = 5000000;
  return Math.min(1, Math.sqrt(payroll / FULL_CREDIBILITY_PAYROLL));
}

export function calculateScheduleCredit(
  workforceMetrics: WorkforceMetrics,
  safetyPrograms: SafetyProgram[],
  yearsInBusiness: number
): number {
  let credit = 0;

  // Workforce stability factors
  if (workforceMetrics.turnoverRate < 0.15) credit += 0.05;
  if (workforceMetrics.avgTenure > 5) credit += 0.03;
  if (workforceMetrics.trainingHoursPerYear > 20) credit += 0.04;

  // Safety program factors
  const activePrograms = safetyPrograms.filter(p => p.status === 'active');
  credit += Math.min(0.10, activePrograms.length * 0.02);

  // Business maturity factor
  if (yearsInBusiness > 10) credit += 0.03;
  else if (yearsInBusiness > 5) credit += 0.02;

  // Cap total credit at 25%
  return Math.min(0.25, credit);
}