import { BusinessInfo, SafetyProgram, RiskControl, LossHistory } from '../../types';

export interface RiskScore {
  total: number;  // 0-100 scale
  components: {
    safetyScore: number;
    lossScore: number;
    controlScore: number;
    industryScore: number;
  };
  factors: {
    name: string;
    impact: number;
    description: string;
  }[];
}

export function calculateRiskScore(data: BusinessInfo): RiskScore {
  const safetyScore = evaluateSafetyPrograms(data.safetyPrograms);
  const lossScore = evaluateLossHistory(data.lossHistory);
  const controlScore = evaluateRiskControls(data.riskControls);
  const industryScore = evaluateIndustryRisk(data);

  const factors = [];
  let total = 0;

  // Safety Program Impact
  if (safetyScore < 60) {
    factors.push({
      name: 'Inadequate Safety Programs',
      impact: -10,
      description: 'Implement comprehensive safety training and monitoring'
    });
  }

  // Loss History Impact
  if (lossScore < 70) {
    factors.push({
      name: 'Adverse Loss History',
      impact: -15,
      description: 'Recent claims indicate need for improved risk management'
    });
  }

  // Risk Control Impact
  if (controlScore < 65) {
    factors.push({
      name: 'Risk Control Deficiencies',
      impact: -12,
      description: 'Strengthen workplace safety measures and protocols'
    });
  }

  // Calculate weighted total score
  total = (
    (safetyScore * 0.3) +
    (lossScore * 0.25) +
    (controlScore * 0.25) +
    (industryScore * 0.2)
  );

  return {
    total: Math.round(total),
    components: {
      safetyScore,
      lossScore,
      controlScore,
      industryScore
    },
    factors
  };
}

function evaluateSafetyPrograms(programs: SafetyProgram[]): number {
  if (!programs.length) return 50;

  const scores = programs.map(program => {
    let score = 0;
    
    // Base score for having a program
    score += 50;
    
    // Implementation status
    if (program.status === 'active') score += 30;
    else if (program.status === 'under_review') score += 15;
    
    // Recent review
    const lastReview = new Date(program.lastReviewDate);
    const monthsSinceReview = (new Date().getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsSinceReview <= 3) score += 20;
    else if (monthsSinceReview <= 6) score += 10;
    
    return score;
  });

  return Math.min(100, scores.reduce((sum, score) => sum + score, 0) / programs.length);
}

function evaluateLossHistory(history: LossHistory[]): number {
  if (!history.length) return 85;

  let score = 100;
  const totalLosses = history.reduce((sum, loss) => sum + loss.amount, 0);
  const recentLosses = history.filter(loss => {
    const lossDate = new Date(loss.date);
    const monthsAgo = (new Date().getTime() - lossDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsAgo <= 12;
  });

  // Impact of total losses
  if (totalLosses > 500000) score -= 30;
  else if (totalLosses > 250000) score -= 20;
  else if (totalLosses > 100000) score -= 10;

  // Impact of recent losses
  score -= (recentLosses.length * 5);

  // Impact of open claims
  const openClaims = history.filter(loss => loss.status === 'open');
  score -= (openClaims.length * 8);

  return Math.max(0, score);
}

function evaluateRiskControls(controls: RiskControl[]): number {
  if (!controls.length) return 50;

  const scores = controls.map(control => {
    let score = 0;
    
    // Base score by effectiveness
    if (control.effectiveness === 'high') score += 80;
    else if (control.effectiveness === 'medium') score += 60;
    else score += 40;
    
    // Recent assessment
    const lastAssessment = new Date(control.lastAssessmentDate);
    const monthsSinceAssessment = (new Date().getTime() - lastAssessment.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsSinceAssessment <= 3) score += 20;
    else if (monthsSinceAssessment <= 6) score += 10;
    
    return score;
  });

  return Math.min(100, scores.reduce((sum, score) => sum + score, 0) / controls.length);
}

function evaluateIndustryRisk(data: BusinessInfo): number {
  // Base score by industry type
  let score = 75;  // Default moderate risk

  // Adjust based on industry indicators in description
  const description = data.description.toLowerCase();
  
  // High-risk industry keywords
  if (description.includes('construction') || 
      description.includes('manufacturing') || 
      description.includes('transportation')) {
    score -= 15;
  }

  // Low-risk industry keywords
  if (description.includes('office') || 
      description.includes('clerical') || 
      description.includes('professional')) {
    score += 15;
  }

  // Adjust for business maturity
  if (data.yearsInBusiness > 10) score += 10;
  else if (data.yearsInBusiness > 5) score += 5;
  else if (data.yearsInBusiness < 2) score -= 5;

  return Math.min(100, Math.max(0, score));
}