import { StudentSegment } from '../data/studentTypes';

export interface SegmentMeta {
  id: StudentSegment;
  title: string;
  badgeColor: string; // Tailwind color styling
  chartColor: string; // Hex for recharts
  description: string;
  recommendedIntervention: string;
  idealProfile: string;
}

export const SEGMENT_CATALOG: Record<StudentSegment, SegmentMeta> = {
  'High academic, low placement': {
    id: 'High academic, low placement',
    title: 'High Academic, Low Placement',
    badgeColor: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    chartColor: '#a855f7',
    description: 'Strong GPA and theoretical mastery, but lagging in hands-on coding tests, aptitude speed, and mock technical interviews.',
    recommendedIntervention: 'Enroll in 6-week Coding Bootcamp & Corporate Mock Interview Lab',
    idealProfile: 'High CGPA (>7.5), low coding score (<55), low aptitude (<60)',
  },
  'High potential, low engagement': {
    id: 'High potential, low engagement',
    title: 'High Potential, Low Engagement',
    badgeColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    chartColor: '#f59e0b',
    description: 'High native aptitude and good exam marks, but low attendance, minimal LMS submissions, and detached from student clubs.',
    recommendedIntervention: 'Assign 1-on-1 Faculty Mentor & Department Project Leadership Role',
    idealProfile: 'Moderate CGPA, high aptitude, low LMS logins & event engagement',
  },
  'Consistent performers': {
    id: 'Consistent performers',
    title: 'Consistent Performers',
    badgeColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    chartColor: '#3b82f6',
    description: 'Steady 75%+ attendance, reliable submissions, solid average marks, on-track to graduate smoothly without backlogs.',
    recommendedIntervention: 'Advanced Industry Certification & Honors Track Guidance',
    idealProfile: 'Balanced metrics across academics, attendance, and LMS',
  },
  'Placement-ready achievers': {
    id: 'Placement-ready achievers',
    title: 'Placement-Ready Achievers',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    chartColor: '#10b981',
    description: 'Top-tier candidates with stellar coding scores, competitive hackathon wins, polished resumes, and strong CGPA.',
    recommendedIntervention: 'Tier-1 High-Package Campus Placement Drives & Peer Tutoring Mentorship',
    idealProfile: 'CGPA > 8.0, Coding > 75, Aptitude > 75, Hackathons >= 2',
  },
  'Disengaged and at risk': {
    id: 'Disengaged and at risk',
    title: 'Disengaged and at Risk',
    badgeColor: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    chartColor: '#ef4444',
    description: 'Compound vulnerabilities: critical attendance deficit (<70%), active backlogs, low LMS engagement, and low placement readiness.',
    recommendedIntervention: 'Emergency Academic Remedial Contract, Parent Sync & Counseling Review',
    idealProfile: 'Low CGPA (<6.0), Backlogs >= 1, Attendance < 70%',
  },
};

/**
 * Classifies a student into one of the 5 segments based on multi-dimensional clustering rules
 */
export function classifyStudentSegment(metrics: {
  normalizedAcademic: number;
  normalizedPlacement: number;
  normalizedEngagement: number;
  normalizedAttendance: number;
  backlogs: number;
  codingScore: number;
  cgpa: number;
}): { segment: StudentSegment; meta: SegmentMeta } {
  const {
    normalizedAcademic,
    normalizedPlacement,
    normalizedEngagement,
    normalizedAttendance,
    backlogs,
    codingScore,
    cgpa,
  } = metrics;

  // 1. Disengaged and at risk
  if (
    backlogs >= 2 ||
    (normalizedAcademic < 48 && normalizedAttendance < 68) ||
    (cgpa < 5.8 && normalizedAttendance < 70)
  ) {
    const meta = SEGMENT_CATALOG['Disengaged and at risk'];
    return { segment: meta.id, meta };
  }

  // 2. Placement-ready achievers
  if (
    normalizedAcademic >= 75 &&
    normalizedPlacement >= 75 &&
    codingScore >= 70 &&
    backlogs === 0
  ) {
    const meta = SEGMENT_CATALOG['Placement-ready achievers'];
    return { segment: meta.id, meta };
  }

  // 3. High academic, low placement
  if (
    normalizedAcademic >= 70 &&
    normalizedPlacement < 58 &&
    codingScore < 58
  ) {
    const meta = SEGMENT_CATALOG['High academic, low placement'];
    return { segment: meta.id, meta };
  }

  // 4. High potential, low engagement
  if (
    normalizedPlacement >= 60 &&
    (normalizedEngagement < 45 || normalizedAttendance < 72)
  ) {
    const meta = SEGMENT_CATALOG['High potential, low engagement'];
    return { segment: meta.id, meta };
  }

  // 5. Consistent performers (default fallback)
  const meta = SEGMENT_CATALOG['Consistent performers'];
  return { segment: meta.id, meta };
}
