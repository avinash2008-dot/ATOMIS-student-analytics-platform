import {
  Student,
  DashboardOverviewData,
  AiDiagnosisResult,
  RemedialPlanResult,
  MentorBriefResult,
  KpmgAuditResult,
  Intervention,
  DegreeCompletionPathResult
} from '../types/student';

const API_BASE = '/api';

async function fetchWithRetry(url: string, options?: RequestInit, retries = 2): Promise<Response> {
  try {
    const res = await fetch(url, options);
    return res;
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 500));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

export interface ResumeAuditResult {
  atsScore: number;
  kpmgFitScore: number;
  verdict: string;
  strengthsFound: string[];
  missingKeywords: string[];
  resumeBulletImprovements: { original: string; improved: string }[];
  gitHubPortfolioAudit: string;
  consultingReadinessNotes: string;
}

export interface SimulationResult {
  projectedAttendance: number;
  projectedCgpa: number;
  remainingBacklogs: number;
  projectedByteXl: number;
  projectedRisk: number;
  projectedLevel: string;
  kpmgEligibility: string;
  attendanceDelta: number;
  riskDelta: number;
  advice: string;
}

export interface PeerMatch {
  menteeId: string;
  menteeName: string;
  menteeRoll: string;
  menteeDept: string;
  menteeRisk: string;
  mentorId: string;
  mentorName: string;
  mentorRoll: string;
  mentorScore: number;
  focusSubject: string;
  recommendedFrequency: string;
}

export interface AlertDispatchResult {
  dispatchId: string;
  timestamp: string;
  studentName: string;
  studentRoll: string;
  channel: string;
  recipient: string;
  messagePreview: string;
  status: string;
  carrierAck: string;
}

export const api = {
  // Check backend health
  async checkHealth() {
    const res = await fetchWithRetry(`${API_BASE}/health`);
    return res.json();
  },

  // Dashboard Overview
  async getDashboardOverview(): Promise<{ success: boolean; data: DashboardOverviewData }> {
    const res = await fetchWithRetry(`${API_BASE}/analytics/dashboard`);
    if (!res.ok) throw new Error('Failed to load dashboard statistics');
    return res.json();
  },

  // Student directory with filters
  async getStudents(params?: {
    search?: string;
    department?: string;
    riskLevel?: string;
    placement?: string;
    sort?: string;
  }): Promise<{ success: boolean; count: number; data: Student[] }> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.department && params.department !== 'All') query.set('department', params.department);
    if (params?.riskLevel && params.riskLevel !== 'All') query.set('riskLevel', params.riskLevel);
    if (params?.placement && params.placement !== 'All') query.set('placement', params.placement);
    if (params?.sort) query.set('sort', params.sort);

    const res = await fetchWithRetry(`${API_BASE}/students?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch students list');
    return res.json();
  },

  // Single student details
  async getStudent(id: string): Promise<{ success: boolean; data: Student }> {
    const res = await fetchWithRetry(`${API_BASE}/students/${id}`);
    if (!res.ok) throw new Error('Student not found');
    return res.json();
  },

  // Create student
  async createStudent(studentData: Partial<Student>): Promise<{ success: boolean; data: Student }> {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    if (!res.ok) throw new Error('Failed to create student record');
    return res.json();
  },

  // Update student
  async updateStudent(id: string, updates: Partial<Student>): Promise<{ success: boolean; data: Student }> {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update student');
    return res.json();
  },

  // Delete student
  async deleteStudent(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete student');
    return res.json();
  },

  // Add intervention
  async addIntervention(studentId: string, intervention: Omit<Intervention, 'id' | 'studentId'>): Promise<{ success: boolean; data: Intervention }> {
    const res = await fetch(`${API_BASE}/students/${studentId}/interventions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(intervention),
    });
    if (!res.ok) throw new Error('Failed to log intervention');
    return res.json();
  },

  // Update intervention status
  async updateInterventionStatus(interventionId: string, status: Intervention['status']): Promise<{ success: boolean; data: Intervention }> {
    const res = await fetch(`${API_BASE}/interventions/${interventionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update intervention');
    return res.json();
  },

  // AI: Deep Risk Diagnosis (Gemini 3.8 Flash)
  async getAiRiskDiagnosis(studentId: string): Promise<{ success: boolean; data: AiDiagnosisResult }> {
    const res = await fetch(`${API_BASE}/ai/predict-risk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    });
    if (!res.ok) throw new Error('AI Diagnosis calculation failed');
    return res.json();
  },

  // AI: Remedial Plan Generator (Gemini 3.8 Flash)
  async generateRemedialPlan(studentId: string, targetGoal?: string): Promise<{ success: boolean; data: RemedialPlanResult }> {
    const res = await fetch(`${API_BASE}/ai/generate-remedial-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, targetGoal }),
    });
    if (!res.ok) throw new Error('Failed to generate remedial study plan');
    return res.json();
  },

  // AI: Mentor Advising Notes or Parent Letter (Gemini 3.8 Flash)
  async generateMentorNote(studentId: string, audience: 'mentor_notes' | 'parent_letter'): Promise<{ success: boolean; data: MentorBriefResult }> {
    const res = await fetch(`${API_BASE}/ai/mentor-note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, audience }),
    });
    if (!res.ok) throw new Error('Failed to generate mentor communication draft');
    return res.json();
  },

  // AI: KPMG Career Readiness Audit (Gemini 3.8 Flash)
  async auditKpmgReadiness(studentId: string, targetRole?: string): Promise<{ success: boolean; data: KpmgAuditResult }> {
    const res = await fetch(`${API_BASE}/ai/career-audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, targetRole }),
    });
    if (!res.ok) throw new Error('Failed to run KPMG career audit');
    return res.json();
  },

  // AI: Student Academic Copilot
  async askStudentCopilot(studentId: string, question: string): Promise<{ success: boolean; data: { reply: string } }> {
    const res = await fetch(`${API_BASE}/ai/student-copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, question }),
    });
    if (!res.ok) throw new Error('Copilot inquiry failed');
    return res.json();
  },

  // NEW AI: KPMG Resume & GitHub Portfolio Audit
  async auditResume(studentId: string, resumeText: string, targetRole?: string): Promise<{ success: boolean; data: ResumeAuditResult }> {
    const res = await fetch(`${API_BASE}/ai/resume-audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, resumeText, targetRole }),
    });
    if (!res.ok) throw new Error('Resume audit failed');
    return res.json();
  },

  // NEW AI: Academic What-If Trajectory Simulator
  async simulateTrajectory(studentId: string, simulatedChanges: {
    additionalAttendanceClasses: number;
    clearedBacklogsTarget: number;
    targetInternalMarks: number;
    byteXlPracticeHoursPerWeek: number;
  }): Promise<{ success: boolean; data: SimulationResult }> {
    const res = await fetch(`${API_BASE}/ai/simulate-scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, simulatedChanges }),
    });
    if (!res.ok) throw new Error('Simulation failed');
    return res.json();
  },

  // NEW AI: Degree Completion Path & Graduation Date Projection
  async projectDegreeCompletionPath(studentId: string): Promise<{ success: boolean; data: DegreeCompletionPathResult }> {
    const res = await fetch(`${API_BASE}/ai/degree-completion-path`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    });
    if (!res.ok) throw new Error('Failed to project degree completion path');
    return res.json();
  },

  // NEW: Peer Mentorship Matches
  async getPeerMatches(): Promise<{ success: boolean; data: PeerMatch[] }> {
    const res = await fetchWithRetry(`${API_BASE}/peer-matches`);
    if (!res.ok) throw new Error('Failed to load peer mentorship matches');
    return res.json();
  },

  // NEW: Dispatch Emergency Alert (Simulation)
  async dispatchAlert(studentId: string, channel: string, recipient: string, message: string): Promise<{ success: boolean; data: AlertDispatchResult }> {
    const res = await fetch(`${API_BASE}/alerts/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, channel, recipient, message }),
    });
    if (!res.ok) throw new Error('Failed to dispatch alert');
    return res.json();
  },

  // Batch import students
  async importBatch(students: any[]): Promise<{ success: boolean; addedCount: number }> {
    const res = await fetch(`${API_BASE}/students/import-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students }),
    });
    if (!res.ok) throw new Error('Failed to import student dataset');
    return res.json();
  },

  // Reset database to default
  async resetData(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/data/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset dataset');
    return res.json();
  }
};
