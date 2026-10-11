import { RiskEvaluation, RiskLevel } from '../data/studentTypes';

interface AcademicInputs {
  cgpa: number;
  internalMarks: number;
  examMarks: number;
  backlogs: number;
  attendance: number;
}

interface PlacementInputs {
  aptitudeScore: number;
  codingScore: number;
  mockInterviewScore: number;
  engagementScore: number;
  technicalSkillScore: number;
  year: number;
}

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

/**
 * Evaluates Academic Risk using logistic combination + rule thresholds:
 * - low CGPA (< 6.0)
 * - backlogs (>= 1)
 * - low attendance (< 75%)
 * - low internal marks (< 28/50)
 */
export function evaluateAcademicRisk(inputs: AcademicInputs): RiskEvaluation {
  const reasons: Array<{ reason: string; severity: number }> = [];

  // Logistic z-score regression weights
  let z = -2.2; // base intercept

  if (inputs.attendance < 75) {
    const gap = 75 - inputs.attendance;
    z += (gap / 10) * 0.85;
    reasons.push({
      reason: `Attendance is ${inputs.attendance}% (below university 75% cutoff)`,
      severity: gap * 1.5,
    });
  }

  if (inputs.backlogs > 0) {
    z += inputs.backlogs * 1.1;
    reasons.push({
      reason: `${inputs.backlogs} active backlog${inputs.backlogs > 1 ? 's' : ''} blocking degree velocity`,
      severity: inputs.backlogs * 25,
    });
  }

  if (inputs.cgpa < 6.5) {
    const cgpaGap = 6.5 - inputs.cgpa;
    z += cgpaGap * 0.9;
    reasons.push({
      reason: `Current CGPA is ${inputs.cgpa.toFixed(2)} (under departmental 6.5 target)`,
      severity: cgpaGap * 20,
    });
  }

  if (inputs.internalMarks < 28) {
    z += ((28 - inputs.internalMarks) / 10) * 0.6;
    reasons.push({
      reason: `Internal mid-term assessment marks at ${inputs.internalMarks}/50`,
      severity: (28 - inputs.internalMarks) * 1.2,
    });
  }

  if (inputs.examMarks < 50) {
    z += ((50 - inputs.examMarks) / 10) * 0.7;
    reasons.push({
      reason: `Semester end exam marks average is ${inputs.examMarks}/100`,
      severity: (50 - inputs.examMarks) * 1.1,
    });
  }

  // Calculate probability 0-100%
  const probRaw = sigmoid(z);
  const probability = Math.round(Math.min(98, Math.max(4, probRaw * 100)));

  let level: RiskLevel = 'Low';
  if (probability >= 65 || inputs.backlogs >= 2 || (inputs.attendance < 65 && inputs.cgpa < 6.0)) {
    level = 'High';
  } else if (probability >= 40 || inputs.backlogs === 1 || inputs.attendance < 75) {
    level = 'Medium';
  }

  // Pick top 3 reasons sorted by severity
  reasons.sort((a, b) => b.severity - a.severity);
  const topReasons = reasons.slice(0, 3).map((r) => r.reason);

  if (topReasons.length === 0) {
    topReasons.push('Consistent academic attendance and zero active backlogs');
  }

  return {
    isRisk: level !== 'Low',
    level,
    probability,
    topReasons,
  };
}

/**
 * Evaluates Placement Readiness Risk using logistic combination + rule thresholds:
 * - low aptitude / coding / mock scores
 * - low engagement & technical skills
 * - especially critical in years 3 and 4
 */
export function evaluatePlacementRisk(inputs: PlacementInputs): RiskEvaluation {
  const reasons: Array<{ reason: string; severity: number }> = [];

  let z = -2.4;

  const yearWeight = inputs.year >= 3 ? 1.4 : 0.8;

  if (inputs.codingScore < 50) {
    const gap = 50 - inputs.codingScore;
    z += (gap / 15) * 1.1 * yearWeight;
    reasons.push({
      reason: `Technical coding benchmark score is ${inputs.codingScore}/100`,
      severity: gap * 1.8,
    });
  }

  if (inputs.aptitudeScore < 55) {
    const gap = 55 - inputs.aptitudeScore;
    z += (gap / 15) * 0.8 * yearWeight;
    reasons.push({
      reason: `Campus aptitude test score is ${inputs.aptitudeScore}/100 (below corporate cutoff)`,
      severity: gap * 1.4,
    });
  }

  if (inputs.mockInterviewScore < 55) {
    const gap = 55 - inputs.mockInterviewScore;
    z += (gap / 15) * 0.9 * yearWeight;
    reasons.push({
      reason: `Mock technical interview rating is ${inputs.mockInterviewScore}/100`,
      severity: gap * 1.3,
    });
  }

  if (inputs.engagementScore < 45) {
    z += 0.5 * yearWeight;
    reasons.push({
      reason: `Low co-curricular participation in campus hackathons & certifications`,
      severity: (45 - inputs.engagementScore) * 1.0,
    });
  }

  if (inputs.technicalSkillScore < 50) {
    z += 0.6 * yearWeight;
    reasons.push({
      reason: `Practical lab skill evaluation is ${inputs.technicalSkillScore}/100`,
      severity: (50 - inputs.technicalSkillScore) * 1.2,
    });
  }

  const probRaw = sigmoid(z);
  const probability = Math.round(Math.min(96, Math.max(5, probRaw * 100)));

  let level: RiskLevel = 'Low';
  if (probability >= 65 || (inputs.codingScore < 40 && inputs.year >= 3)) {
    level = 'High';
  } else if (probability >= 40 || (inputs.codingScore < 55 && inputs.year >= 3)) {
    level = 'Medium';
  }

  reasons.sort((a, b) => b.severity - a.severity);
  const topReasons = reasons.slice(0, 3).map((r) => r.reason);

  if (topReasons.length === 0) {
    topReasons.push('Strong placement aptitude, competitive coding scores and projects');
  }

  return {
    isRisk: level !== 'Low',
    level,
    probability,
    topReasons,
  };
}

export function determineOverallRisk(academic: RiskEvaluation, placement: RiskEvaluation): RiskLevel {
  if (academic.level === 'High' || placement.level === 'High') return 'High';
  if (academic.level === 'Medium' || placement.level === 'Medium') return 'Medium';
  return 'Low';
}
