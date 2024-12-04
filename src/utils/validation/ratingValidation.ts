import { BusinessInfo, PayrollInfo, LossHistory } from '../../types';

export interface RatingValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateRatingData(data: BusinessInfo): RatingValidation {
  const result: RatingValidation = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Validate payroll data
  validatePayroll(data.payrollInfo, result);

  // Validate loss history
  validateLossHistory(data.lossHistory, result);

  // Validate experience mod
  if (data.modifiers.experienceMod < 0.75 || data.modifiers.experienceMod > 2.00) {
    result.errors.push('Experience mod must be between 0.75 and 2.00');
  }

  // Validate schedule credit
  if (Math.abs(data.modifiers.scheduleCredit) > 0.25) {
    result.errors.push('Schedule credit/debit cannot exceed 25%');
  }

  // Set overall validity
  result.isValid = result.errors.length === 0;

  return result;
}

function validatePayroll(payroll: PayrollInfo[], result: RatingValidation) {
  if (!payroll.length) {
    result.errors.push('At least one payroll classification is required');
    return;
  }

  payroll.forEach((info, index) => {
    // Validate required fields
    if (!info.stateCode || !info.classCode) {
      result.errors.push(`Payroll classification ${index + 1} is missing required information`);
    }

    // Validate payroll amounts
    if (info.annualPayroll <= 0) {
      result.errors.push(`Invalid payroll amount for classification ${index + 1}`);
    }

    // Validate employee counts
    if (info.employeeCount <= 0) {
      result.errors.push(`Invalid employee count for classification ${index + 1}`);
    }

    // Check for reasonable average payroll
    const avgPayroll = info.annualPayroll / info.employeeCount;
    if (avgPayroll < 20000 || avgPayroll > 200000) {
      result.warnings.push(
        `Average payroll of ${avgPayroll.toFixed(2)} for class ${info.classCode} seems unusual`
      );
    }
  });
}

function validateLossHistory(losses: LossHistory[], result: RatingValidation) {
  if (!losses.length) {
    result.warnings.push('No loss history provided');
    return;
  }

  losses.forEach((loss, index) => {
    // Validate dates
    const lossDate = new Date(loss.date);
    if (isNaN(lossDate.getTime())) {
      result.errors.push(`Invalid date for loss ${index + 1}`);
    }

    // Validate amounts
    if (loss.amount <= 0) {
      result.errors.push(`Invalid amount for loss ${index + 1}`);
    }

    // Check for missing claim numbers
    if (!loss.claimNumber) {
      result.warnings.push(`Missing claim number for loss ${index + 1}`);
    }

    // Validate status
    if (!['open', 'closed'].includes(loss.status)) {
      result.errors.push(`Invalid status for loss ${index + 1}`);
    }
  });
}