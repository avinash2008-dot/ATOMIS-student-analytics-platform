export type RiskLevel = 'Critical' | 'Moderate' | 'Low' | 'Exemplary';
export type Department = 'Computer Science' | 'Information Technology' | 'AI & Data Science' | 'Electronics & Comm';
export type PlacementEligibility = 'Eligible' | 'Borderline' | 'Ineligible';

export interface AcademicRecord {
  semester: number;
  sgpa: number;
  credits: number;
  backlogs: number;
  subjects: {
    code: string;
    name: string;
    grade: string;
    marks: number;
    maxMarks: number;
    attendancePercent: number;
    status: 'Pass' | 'Fail' | 'At Risk';
  }[];
}

export interface SkillBenchmark {
  category: string;
  score: number;
  percentile: number;
  status: 'Strong' | 'Average' | 'Needs Improvement';
}

export interface Intervention {
  id: string;
  studentId: string;
  date: string;
  type: 'Academic Tutoring' | 'Attendance Counseling' | 'Mental Health / Wellbeing' | 'Placement Mentorship' | 'Parent Notification';
  mentorName: string;
  notes: string;
  actionItems: string[];
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
  followUpDate: string;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  department: Department;
  year: number;
  semester: number;
  section: string;
  avatar: string;
  mentor: string;
  cgpa: number;
  activeBacklogs: number;
  clearedBacklogs: number;
  overallAttendance: number;
  recentAbsenceStreak: number;
  lmsEngagementScore: number;
  assignmentSubmissionRate: number;
  codingProfile: {
    byteXlScore: number;
    problemsSolved: number;
    githubCommitsThisMonth: number;
    dsaProficiency: number;
    sqlProficiency: number;
    webDevProficiency: number;
  };
  kpmgReadinessScore: number;
  placementEligibility: PlacementEligibility;
  riskScore: number;
  riskLevel: RiskLevel;
  riskFactors: string[];
  academicRecords: AcademicRecord[];
  skillBenchmarks: SkillBenchmark[];
  interventions: Intervention[];
  aiNotes?: {
    lastDiagnosed?: string;
    summary?: string;
    recommendedActions?: string[];
  };
}

export interface DashboardOverviewData {
  totalStudents: number;
  riskDistribution: {
    critical: number;
    moderate: number;
    low: number;
    exemplary: number;
  };
  averages: {
    cgpa: number;
    attendance: number;
    byteXlScore: number;
    kpmgReadiness: number;
  };
  placementStats: {
    eligible: number;
    borderline: number;
    ineligible: number;
    eligibilityRate: number;
  };
  departmentStats: {
    name: Department;
    totalStudents: number;
    criticalCount: number;
    avgCgpa: number;
    avgAttendance: number;
    avgByteXl: number;
    riskPercentage: number;
  }[];
  activeInterventionsCount: number;
  recentAlerts: {
    studentId: string;
    name: string;
    rollNo: string;
    department: Department;
    riskScore: number;
    riskLevel: RiskLevel;
    attendance: number;
    backlogs: number;
    streak: number;
    primaryFactor: string;
  }[];
}

export interface AiDiagnosisResult {
  clinicalSummary: string;
  primaryThreatVector: string;
  projectedTrajectory: string;
  confidenceScore: number;
  topDrivers: {
    factor: string;
    severity: 'High' | 'Medium' | 'Low';
    observation: string;
  }[];
  immediateFacultyAction: string;
}

export interface RemedialPlanResult {
  planTitle: string;
  focusAreas: string[];
  weeklyMilestones: {
    week: number;
    theme: string;
    hoursPerWeek: number;
    tasks: string[];
    byteXlModules: string[];
  }[];
  recommendedResources: string[];
  kpiTarget: string;
}

export interface MentorBriefResult {
  subject: string;
  content: string;
  recommendedTalkingPoints: string[];
  followUpAction: string;
}

export interface KpmgAuditResult {
  readinessScore: number;
  hiringVerdict: string;
  kpmgCompetencies: {
    competency: string;
    rating: number;
    benchmark: number;
    status: string;
  }[];
  keyStrengths: string[];
  criticalGaps: string[];
  recommendedActionItems: string[];
  mockInterviewQuestions: string[];
}

export interface DegreeTermMilestone {
  termName: string;
  semesterNumber: number;
  regularCredits: number;
  backlogCreditsScheduled: number;
  totalCredits: number;
  status: 'Completed' | 'In Progress' | 'Projected Regular' | 'Projected Remedial' | 'Degree Conferred';
  focusSubjects: string[];
  projectedPassRate: number;
  milestoneKey: string;
}

export interface DegreeCompletionPathResult {
  projectedGraduationDate: string;
  standardGraduationDate: string;
  graduationStatus: 'On-Track' | 'At-Risk (1 Term Delay)' | 'Critical Delay (1+ Years)';
  onTimeCompletionProbability: number;
  totalCreditsRequired: number;
  creditsEarned: number;
  backlogCreditsPending: number;
  remainingRegularCredits: number;
  historicalPassRate: number;
  creditRecoveryVelocity: string;
  termMilestones: DegreeTermMilestone[];
  criticalBacklogChokepoints: {
    subjectName: string;
    credits: number;
    prerequisiteFor: string;
    recommendedAttemptTerm: string;
  }[];
  accelerationStrategies: string[];
  aiAdvisorVerdict: string;
}

export interface StudentGoal {
  id: string;
  studentId: string;
  title: string;
  category: 'Academic' | 'Skill' | 'Attendance' | 'Career';
  currentValue: string;
  targetValue: string;
  deadline: string;
  progressPercentage: number;
  milestones: { task: string; completed: boolean }[];
  status: 'In Progress' | 'Achieved' | 'Needs Attention';
}

export interface PersonalizedLearningItem {
  id: string;
  title: string;
  type: 'Video' | 'Course' | 'Article' | 'Quiz' | 'Practice' | 'Project' | 'Mentor';
  provider: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  subjectArea: string;
  relevanceReason: string;
  actionUrl?: string;
  completed?: boolean;
}

export interface TopicDifficulty {
  subject: string;
  topic: string;
  avgScore: number;
  failureRate: number;
  studentsAtRiskCount: number;
  difficultyLevel: 'High' | 'Medium' | 'Low';
  recommendedIntervention: string;
}

export interface ParentPortalProfile {
  studentId: string;
  parentName: string;
  relation: string;
  phone: string;
  email: string;
  privacyControls: {
    canViewGrades: boolean;
    canViewAttendance: boolean;
    canViewTeacherNotes: boolean;
    canViewDisciplinaryAlerts: boolean;
  };
  lastLogin: string;
}

export interface CollegeMacroAnalytics {
  totalEnrolled: number;
  retentionRate: number;
  graduationRate: number;
  dropoutRiskRate: number;
  interventionsActive: number;
  interventionSuccessRate: number;
  departmentComparisons: {
    department: Department;
    enrolled: number;
    avgGpa: number;
    attendanceRate: number;
    dropoutRiskCount: number;
  }[];
  cohortRetention: {
    cohortYear: string;
    startCount: number;
    retainedCount: number;
    retentionRate: number;
  }[];
}
