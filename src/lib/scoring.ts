import {
  ScoreWeights,
  ScoreBand,
  ScoreBreakdownItem,
} from '../data/studentTypes';

export const DEFAULT_WEIGHTS: ScoreWeights = {
  academic: 0.35,
  attendance: 0.15,
  lms: 0.15,
  engagement: 0.10,
  placement: 0.15,
  skills: 0.05,
  feedback: 0.05,
};

/**
 * Normalizes raw academic metrics to a 0-100 scale:
 * - CGPA contributes up to 60 points
 * - Internal marks contribute up to 20 points
 * - Exam marks contribute up to 20 points
 * - Active backlogs apply an 8-point penalty per backlog
 */
export function normalizeAcademic(
  cgpa: number,
  internalMarks: number,
  examMarks: number,
  backlogs: number
): number {
  const cgpaPoints = (Math.max(0, Math.min(10, cgpa)) / 10) * 60;
  const internalPoints = (Math.max(0, Math.min(50, internalMarks)) / 50) * 20;
  const examPoints = (Math.max(0, Math.min(100, examMarks)) / 100) * 20;
  const backlogPenalty = Math.max(0, backlogs) * 8;

  const raw = cgpaPoints + internalPoints + examPoints - backlogPenalty;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

/**
 * Normalizes LMS indicators to a 0-100 scale:
 * - Logins/week up to 30 pts
 * - Assignment completion up to 40 pts
 * - Course content views up to 30 pts
 */
export function normalizeLms(
  loginsPerWeek: number,
  assignmentPct: number,
  contentViews: number
): number {
  const loginPts = (Math.min(25, Math.max(0, loginsPerWeek)) / 25) * 30;
  const assignPts = (Math.min(100, Math.max(0, assignmentPct)) / 100) * 40;
  const viewPts = (Math.min(200, Math.max(0, contentViews)) / 200) * 30;
  return Math.max(0, Math.min(100, Math.round(loginPts + assignPts + viewPts)));
}

/**
 * Normalizes campus engagement activities:
 * - Events (35 pts), clubs (20 pts), hackathons (25 pts), certifications (20 pts)
 */
export function normalizeEngagement(
  events: number,
  clubs: number,
  hackathons: number,
  certs: number
): number {
  const eventPts = (Math.min(10, Math.max(0, events)) / 10) * 35;
  const clubPts = (Math.min(3, Math.max(0, clubs)) / 3) * 20;
  const hackPts = (Math.min(5, Math.max(0, hackathons)) / 5) * 25;
  const certPts = (Math.min(6, Math.max(0, certs)) / 6) * 20;
  return Math.max(0, Math.min(100, Math.round(eventPts + clubPts + hackPts + certPts)));
}

/**
 * Normalizes placement preparedness:
 * - Aptitude (35%), Coding assessment (40%), Mock interview (25%)
 */
export function normalizePlacement(
  aptitude: number,
  coding: number,
  mockInterview: number
): number {
  const apt = Math.min(100, Math.max(0, aptitude)) * 0.35;
  const code = Math.min(100, Math.max(0, coding)) * 0.40;
  const mock = Math.min(100, Math.max(0, mockInterview)) * 0.25;
  return Math.max(0, Math.min(100, Math.round(apt + code + mock)));
}

/**
 * Normalizes technical & soft skills:
 * - Technical skill (65%), Soft skill (35%)
 */
export function normalizeSkills(tech: number, soft: number): number {
  const t = Math.min(100, Math.max(0, tech)) * 0.65;
  const s = Math.min(100, Math.max(0, soft)) * 0.35;
  return Math.max(0, Math.min(100, Math.round(t + s)));
}

/**
 * Normalizes satisfaction & faculty ratings (1-5 scale to 100)
 */
export function normalizeFeedback(studentSat: number, facultyRating: number): number {
  const avg = (Math.max(1, studentSat) + Math.max(1, facultyRating)) / 2;
  return Math.max(0, Math.min(100, Math.round((avg / 5) * 100)));
}

/**
 * Determines score classification band:
 * - 80+ Thriving
 * - 60-79 On Track
 * - 40-59 Needs Attention
 * - <40 Critical
 */
export function getScoreBand(score: number): ScoreBand {
  if (score >= 80) return 'Thriving';
  if (score >= 60) return 'On Track';
  if (score >= 40) return 'Needs Attention';
  return 'Critical';
}

/**
 * Computes weighted Student Success Score (0-100)
 */
export function calculateSuccessScore(
  normalized: {
    academic: number;
    attendance: number;
    lms: number;
    engagement: number;
    placement: number;
    skills: number;
    feedback: number;
  },
  weights: ScoreWeights = DEFAULT_WEIGHTS,
  cohortAverages?: Record<string, number>
): {
  score: number;
  band: ScoreBand;
  breakdown: ScoreBreakdownItem[];
} {
  const breakdown: ScoreBreakdownItem[] = [
    {
      indicator: 'Academic Performance',
      rawScore: normalized.academic,
      normalizedScore: normalized.academic,
      weight: weights.academic,
      weightedPoints: Number((normalized.academic * weights.academic).toFixed(1)),
      cohortAverage: cohortAverages?.academic ?? 68,
      deltaVsAverage: Number((normalized.academic - (cohortAverages?.academic ?? 68)).toFixed(1)),
    },
    {
      indicator: 'Classroom Attendance',
      rawScore: normalized.attendance,
      normalizedScore: normalized.attendance,
      weight: weights.attendance,
      weightedPoints: Number((normalized.attendance * weights.attendance).toFixed(1)),
      cohortAverage: cohortAverages?.attendance ?? 75,
      deltaVsAverage: Number((normalized.attendance - (cohortAverages?.attendance ?? 75)).toFixed(1)),
    },
    {
      indicator: 'LMS Activity & Submissions',
      rawScore: normalized.lms,
      normalizedScore: normalized.lms,
      weight: weights.lms,
      weightedPoints: Number((normalized.lms * weights.lms).toFixed(1)),
      cohortAverage: cohortAverages?.lms ?? 65,
      deltaVsAverage: Number((normalized.lms - (cohortAverages?.lms ?? 65)).toFixed(1)),
    },
    {
      indicator: 'Campus Engagement & Events',
      rawScore: normalized.engagement,
      normalizedScore: normalized.engagement,
      weight: weights.engagement,
      weightedPoints: Number((normalized.engagement * weights.engagement).toFixed(1)),
      cohortAverage: cohortAverages?.engagement ?? 55,
      deltaVsAverage: Number((normalized.engagement - (cohortAverages?.engagement ?? 55)).toFixed(1)),
    },
    {
      indicator: 'Placement Readiness',
      rawScore: normalized.placement,
      normalizedScore: normalized.placement,
      weight: weights.placement,
      weightedPoints: Number((normalized.placement * weights.placement).toFixed(1)),
      cohortAverage: cohortAverages?.placement ?? 62,
      deltaVsAverage: Number((normalized.placement - (cohortAverages?.placement ?? 62)).toFixed(1)),
    },
    {
      indicator: 'Technical & Soft Skills',
      rawScore: normalized.skills,
      normalizedScore: normalized.skills,
      weight: weights.skills,
      weightedPoints: Number((normalized.skills * weights.skills).toFixed(1)),
      cohortAverage: cohortAverages?.skills ?? 64,
      deltaVsAverage: Number((normalized.skills - (cohortAverages?.skills ?? 64)).toFixed(1)),
    },
    {
      indicator: 'Student & Faculty Feedback',
      rawScore: normalized.feedback,
      normalizedScore: normalized.feedback,
      weight: weights.feedback,
      weightedPoints: Number((normalized.feedback * weights.feedback).toFixed(1)),
      cohortAverage: cohortAverages?.feedback ?? 70,
      deltaVsAverage: Number((normalized.feedback - (cohortAverages?.feedback ?? 70)).toFixed(1)),
    },
  ];

  const totalPoints = breakdown.reduce((sum, item) => sum + item.weightedPoints, 0);
  const score = Math.max(0, Math.min(100, Math.round(totalPoints)));
  const band = getScoreBand(score);

  return { score, band, breakdown };
}
