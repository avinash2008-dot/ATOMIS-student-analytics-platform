export type Department = 'CSE' | 'ECE' | 'MECH' | 'CIVIL';
export type YearLevel = 1 | 2 | 3 | 4;

export interface SubjectScore {
  code: string;
  name: string;
  marks: number;       // 0-100
  attendance: number;  // 0-100
}

// ==========================================
// 7 RAW SOURCE TABLE SCHEMAS (B1)
// ==========================================

export interface RawAcademicRecord {
  student_id: string;
  name: string;
  department: string;
  year: number;
  section: string;
  cgpa: number | null;                // 0.0 - 10.0 (may have outliers or missing)
  internal_marks: number | null;      // 0 - 50
  exam_marks: number | null;          // 0 - 100
  backlogs: number | null;            // 0 - 6
  subjects: SubjectScore[];
}

export interface RawAttendanceRecord {
  student_id: string;
  overall_attendance_pct: number | null; // 0 - 100 (outliers e.g. >100 or <0)
  subject_attendance: Record<string, number>;
}

export interface RawLmsRecord {
  student_id: string;
  logins_per_week: number | null;         // 0 - 35
  assignment_completion_pct: number | null; // 0 - 100
  content_views: number | null;           // 0 - 250
}

export interface RawEngagementRecord {
  student_id: string;
  events_participated: number | null;     // 0 - 15
  club_memberships: number | null;        // 0 - 5
  hackathons_attended: number | null;     // 0 - 8
  certifications_completed: number | null;// 0 - 10
}

export interface RawPlacementRecord {
  student_id: string;
  aptitude_score: number | null;          // 0 - 100
  coding_score: number | null;            // 0 - 100
  mock_interview_score: number | null;    // 0 - 100
}

export interface RawSkillsRecord {
  student_id: string;
  technical_skill_score: number | null;   // 0 - 100
  soft_skill_score: number | null;        // 0 - 100
}

export interface RawFeedbackRecord {
  student_id: string;
  student_satisfaction: number | null;    // 1 - 5
  faculty_feedback_rating: number | null; // 1 - 5
}

// ==========================================
// UNIFIED CLEANED STUDENT PROFILE
// ==========================================

export type ScoreBand = 'Thriving' | 'On Track' | 'Needs Attention' | 'Critical';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type StudentSegment =
  | 'High academic, low placement'
  | 'High potential, low engagement'
  | 'Consistent performers'
  | 'Placement-ready achievers'
  | 'Disengaged and at risk';

export interface ScoreBreakdownItem {
  indicator: string;
  rawScore: number;          // original metric
  normalizedScore: number;   // 0 - 100
  weight: number;            // e.g. 0.35
  weightedPoints: number;    // contribution
  cohortAverage: number;     // for comparison
  deltaVsAverage: number;    // positive or negative
}

export interface RiskEvaluation {
  isRisk: boolean;
  level: RiskLevel;
  probability: number;       // 0 - 100%
  topReasons: string[];
}

export interface UnifiedStudent {
  student_id: string;
  name: string;
  department: Department;
  year: YearLevel;
  section: string;
  email: string;
  avatar: string;

  // Cleaned metrics
  cgpa: number;
  internal_marks: number;
  exam_marks: number;
  backlogs: number;
  overall_attendance: number;
  lms_logins_per_week: number;
  assignment_completion_pct: number;
  lms_content_views: number;
  events_count: number;
  certifications_count: number;
  hackathons_count: number;
  aptitude_score: number;
  coding_score: number;
  mock_interview_score: number;
  technical_skill_score: number;
  soft_skill_score: number;
  student_satisfaction: number;
  faculty_feedback_rating: number;
  subjects: SubjectScore[];

  // Normalized (0 - 100) indicators
  normalized: {
    academic: number;
    attendance: number;
    lms: number;
    engagement: number;
    placement: number;
    skills: number;
    feedback: number;
  };

  // Student Success Score (0 - 100)
  successScore: number;
  scoreBand: ScoreBand;
  breakdown: ScoreBreakdownItem[];

  // At-risk identification
  academicRisk: RiskEvaluation;
  placementRisk: RiskEvaluation;
  overallRiskLevel: RiskLevel;
  primaryRiskReason: string;

  // Segmentation
  segment: StudentSegment;
  segmentDescription: string;
  recommendedIntervention: string;
  interventionStatus: 'Pending' | 'In progress' | 'Done';

  // Plain-English explainable summary (B4)
  explainableSentence: string;
}

export interface ScoreWeights {
  academic: number;    // default 0.35
  attendance: number;  // default 0.15
  lms: number;         // default 0.15
  engagement: number;  // default 0.10
  placement: number;   // default 0.15
  skills: number;      // default 0.05
  feedback: number;    // default 0.05
}

export interface DataQualityReport {
  rawRowCount: number;
  dedupedCount: number;
  missingValuesFixed: number;
  outliersCapped: number;
  mergedStudentsCount: number;
  beforeQualityPct: number;
  afterQualityPct: number;
  sourceCounts: {
    academic: number;
    attendance: number;
    lms: number;
    engagement: number;
    placement: number;
    skills: number;
    feedback: number;
  };
}
