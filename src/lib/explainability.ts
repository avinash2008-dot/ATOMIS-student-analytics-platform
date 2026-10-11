import { ScoreBreakdownItem, RiskEvaluation } from '../data/studentTypes';

export interface ExplainabilityPoint {
  label: string;
  contribution: number;   // + points or - points vs cohort
  rawVal: string;
  cohortAvg: string;
  isPositive: boolean;
}

/**
 * Generates a plain-English summary explaining why a student has their current
 * success score and risk status.
 */
export function generatePlainEnglishExplanation(params: {
  name: string;
  successScore: number;
  academicRisk: RiskEvaluation;
  placementRisk: RiskEvaluation;
  attendance: number;
  backlogs: number;
  cgpa: number;
  codingScore: number;
  lmsAssignmentPct: number;
}): string {
  const {
    academicRisk,
    placementRisk,
    attendance,
    backlogs,
    cgpa,
    codingScore,
    lmsAssignmentPct,
  } = params;

  if (academicRisk.level === 'High') {
    const reasons: string[] = [];
    if (attendance < 75) reasons.push(`attendance is ${attendance}% (below 75% cutoff)`);
    if (backlogs > 0) reasons.push(`${backlogs} backlog${backlogs > 1 ? 's are' : ' is'} active`);
    if (cgpa < 6.5) reasons.push(`CGPA is ${cgpa.toFixed(2)}`);
    return `Academic risk is HIGH mainly because ${reasons.join(' and ')}. Immediate mentor check-in required.`;
  }

  if (placementRisk.level === 'High') {
    const reasons: string[] = [];
    if (codingScore < 50) reasons.push(`coding benchmark is ${codingScore}/100`);
    if (cgpa < 6.5) reasons.push(`CGPA is ${cgpa.toFixed(2)}`);
    return `Placement risk is HIGH primarily because ${reasons.join(' and ')}. Recommended for targeted aptitude and lab drill.`;
  }

  if (academicRisk.level === 'Medium' || placementRisk.level === 'Medium') {
    const triggers: string[] = [];
    if (attendance < 78) triggers.push(`attendance is ${attendance}%`);
    if (lmsAssignmentPct < 65) triggers.push(`assignment completion is ${lmsAssignmentPct}%`);
    if (codingScore < 60) triggers.push(`coding score is ${codingScore}/100`);
    return `Student needs attention as ${triggers.slice(0, 2).join(' and ')}. Early nudge will prevent escalation.`;
  }

  return `Student is THRIVING with consistent ${attendance}% attendance, solid ${cgpa.toFixed(2)} CGPA, and competitive placement readiness.`;
}

/**
 * Generates the waterfall/horizontal delta points vs cohort average
 */
export function generateWaterfallContributions(
  breakdown: ScoreBreakdownItem[]
): ExplainabilityPoint[] {
  return breakdown.map((item) => {
    // Weighted points delta vs expected points at cohort average
    const expectedPoints = item.cohortAverage * item.weight;
    const diff = Number((item.weightedPoints - expectedPoints).toFixed(1));

    return {
      label: item.indicator,
      contribution: diff,
      rawVal: `${item.normalizedScore}/100`,
      cohortAvg: `${item.cohortAverage}/100`,
      isPositive: diff >= 0,
    };
  });
}
