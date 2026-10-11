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
  score: number; // 0 - 100
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
  department: 'Computer Science' | 'Information Technology' | 'AI & Data Science' | 'Electronics & Comm';
  year: number;
  semester: number;
  section: string;
  avatar: string;
  mentor: string;
  cgpa: number;
  activeBacklogs: number;
  clearedBacklogs: number;
  overallAttendance: number; // percentage
  recentAbsenceStreak: number; // days
  lmsEngagementScore: number; // 0 - 100
  assignmentSubmissionRate: number; // percentage
  codingProfile: {
    byteXlScore: number; // 0 - 100
    problemsSolved: number;
    githubCommitsThisMonth: number;
    dsaProficiency: number; // 0 - 100
    sqlProficiency: number;
    webDevProficiency: number;
  };
  kpmgReadinessScore: number; // 0 - 100
  placementEligibility: 'Eligible' | 'Borderline' | 'Ineligible';
  riskScore: number; // 0 - 100
  riskLevel: 'Critical' | 'Moderate' | 'Low' | 'Exemplary';
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

// Initial rich database of students
export const initialStudents: Student[] = [
  {
    id: "STU-2026-001",
    rollNo: "22CS101",
    name: "Aarav Sharma",
    email: "aarav.sharma@college.edu.in",
    department: "Computer Science",
    year: 3,
    semester: 5,
    section: "A",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    mentor: "Dr. Ramesh Babu",
    cgpa: 5.62,
    activeBacklogs: 3,
    clearedBacklogs: 1,
    overallAttendance: 61.5,
    recentAbsenceStreak: 4,
    lmsEngagementScore: 38,
    assignmentSubmissionRate: 54,
    codingProfile: {
      byteXlScore: 42,
      problemsSolved: 48,
      githubCommitsThisMonth: 3,
      dsaProficiency: 35,
      sqlProficiency: 45,
      webDevProficiency: 50
    },
    kpmgReadinessScore: 44,
    placementEligibility: "Ineligible",
    riskScore: 84,
    riskLevel: "Critical",
    riskFactors: [
      "Attendance below mandatory 75% threshold (61.5%)",
      "3 active backlogs in core computing subjects (Data Structures, OS, DAA)",
      "Sharp CGPA decline from 6.8 to 5.62 across past 2 semesters",
      "LMS submission rate lagging at 54%"
    ],
    academicRecords: [
      {
        semester: 4,
        sgpa: 5.4,
        credits: 22,
        backlogs: 2,
        subjects: [
          { code: "CS401", name: "Design & Analysis of Algorithms", grade: "F", marks: 32, maxMarks: 100, attendancePercent: 58, status: "Fail" },
          { code: "CS402", name: "Operating Systems", grade: "F", marks: 35, maxMarks: 100, attendancePercent: 62, status: "Fail" },
          { code: "CS403", name: "Database Systems", grade: "C", marks: 58, maxMarks: 100, attendancePercent: 71, status: "Pass" },
          { code: "CS404", name: "Computer Networks", grade: "B", marks: 64, maxMarks: 100, attendancePercent: 68, status: "Pass" }
        ]
      },
      {
        semester: 3,
        sgpa: 5.8,
        credits: 22,
        backlogs: 1,
        subjects: [
          { code: "CS301", name: "Data Structures", grade: "F", marks: 38, maxMarks: 100, attendancePercent: 64, status: "Fail" },
          { code: "CS302", name: "Digital Logic Design", grade: "C", marks: 52, maxMarks: 100, attendancePercent: 66, status: "Pass" },
          { code: "CS303", name: "Object Oriented Programming", grade: "B", marks: 66, maxMarks: 100, attendancePercent: 74, status: "Pass" }
        ]
      }
    ],
    skillBenchmarks: [
      { category: "Data Structures & Algorithms", score: 35, percentile: 28, status: "Needs Improvement" },
      { category: "Database & SQL", score: 45, percentile: 41, status: "Needs Improvement" },
      { category: "Full-Stack Web Dev", score: 50, percentile: 46, status: "Average" },
      { category: "Analytical & Aptitude", score: 48, percentile: 39, status: "Needs Improvement" },
      { category: "Communication & Soft Skills", score: 55, percentile: 52, status: "Average" }
    ],
    interventions: [
      {
        id: "INT-101",
        studentId: "STU-2026-001",
        date: "2026-09-18",
        type: "Attendance Counseling",
        mentorName: "Dr. Ramesh Babu",
        notes: "Student informed about falling below 65%. Cited health and commuting challenges.",
        actionItems: ["Medical certificate submission", "Bi-weekly mentor check-in", "Mandatory attendance in DAA extra classes"],
        status: "In Progress",
        followUpDate: "2026-10-12"
      }
    ]
  },
  {
    id: "STU-2026-002",
    rollNo: "22IT104",
    name: "Sneha Patel",
    email: "sneha.patel@college.edu.in",
    department: "Information Technology",
    year: 3,
    semester: 5,
    section: "B",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    mentor: "Prof. Anjali Verma",
    cgpa: 8.92,
    activeBacklogs: 0,
    clearedBacklogs: 0,
    overallAttendance: 92.4,
    recentAbsenceStreak: 0,
    lmsEngagementScore: 95,
    assignmentSubmissionRate: 98,
    codingProfile: {
      byteXlScore: 91,
      problemsSolved: 340,
      githubCommitsThisMonth: 42,
      dsaProficiency: 88,
      sqlProficiency: 92,
      webDevProficiency: 94
    },
    kpmgReadinessScore: 94,
    placementEligibility: "Eligible",
    riskScore: 8,
    riskLevel: "Exemplary",
    riskFactors: [],
    academicRecords: [
      {
        semester: 4,
        sgpa: 9.1,
        credits: 22,
        backlogs: 0,
        subjects: [
          { code: "IT401", name: "Cloud Computing & Distributed Systems", grade: "A+", marks: 94, maxMarks: 100, attendancePercent: 96, status: "Pass" },
          { code: "IT402", name: "Information Security", grade: "A", marks: 88, maxMarks: 100, attendancePercent: 90, status: "Pass" },
          { code: "IT403", name: "Data Warehousing & Mining", grade: "A+", marks: 92, maxMarks: 100, attendancePercent: 94, status: "Pass" }
        ]
      }
    ],
    skillBenchmarks: [
      { category: "Data Structures & Algorithms", score: 88, percentile: 94, status: "Strong" },
      { category: "Database & SQL", score: 92, percentile: 96, status: "Strong" },
      { category: "Full-Stack Web Dev", score: 94, percentile: 98, status: "Strong" },
      { category: "Analytical & Aptitude", score: 90, percentile: 95, status: "Strong" },
      { category: "Communication & Soft Skills", score: 88, percentile: 92, status: "Strong" }
    ],
    interventions: []
  },
  {
    id: "STU-2026-003",
    rollNo: "22AI108",
    name: "Rohan Kulkarni",
    email: "rohan.kulkarni@college.edu.in",
    department: "AI & Data Science",
    year: 3,
    semester: 5,
    section: "A",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    mentor: "Dr. Vikram Seth",
    cgpa: 6.85,
    activeBacklogs: 1,
    clearedBacklogs: 1,
    overallAttendance: 72.0,
    recentAbsenceStreak: 2,
    lmsEngagementScore: 62,
    assignmentSubmissionRate: 70,
    codingProfile: {
      byteXlScore: 68,
      problemsSolved: 142,
      githubCommitsThisMonth: 12,
      dsaProficiency: 65,
      sqlProficiency: 72,
      webDevProficiency: 60
    },
    kpmgReadinessScore: 66,
    placementEligibility: "Borderline",
    riskScore: 52,
    riskLevel: "Moderate",
    riskFactors: [
      "Attendance hovering at 72% (just below 75% placement cutoff)",
      "1 active backlog in Probability & Statistics for AI",
      "Inconsistent submissions in technical programming assessments"
    ],
    academicRecords: [
      {
        semester: 4,
        sgpa: 6.7,
        credits: 22,
        backlogs: 1,
        subjects: [
          { code: "AI401", name: "Machine Learning Foundations", grade: "B", marks: 68, maxMarks: 100, attendancePercent: 78, status: "Pass" },
          { code: "AI402", name: "Probability & Statistics", grade: "F", marks: 38, maxMarks: 100, attendancePercent: 68, status: "Fail" },
          { code: "AI403", name: "Python for Data Science", grade: "A", marks: 82, maxMarks: 100, attendancePercent: 85, status: "Pass" }
        ]
      }
    ],
    skillBenchmarks: [
      { category: "Data Structures & Algorithms", score: 65, percentile: 62, status: "Average" },
      { category: "Database & SQL", score: 72, percentile: 74, status: "Average" },
      { category: "Machine Learning & AI", score: 70, percentile: 71, status: "Average" },
      { category: "Analytical & Aptitude", score: 60, percentile: 58, status: "Average" },
      { category: "Communication & Soft Skills", score: 65, percentile: 66, status: "Average" }
    ],
    interventions: [
      {
        id: "INT-102",
        studentId: "STU-2026-003",
        date: "2026-09-25",
        type: "Academic Tutoring",
        mentorName: "Dr. Vikram Seth",
        notes: "Advised to register for the remedial crash course in Statistics before semester end.",
        actionItems: ["Complete 5 assignments in Statistics portal", "Attend Saturday tutorial"],
        status: "Open",
        followUpDate: "2026-10-15"
      }
    ]
  },
  {
    id: "STU-2026-004",
    rollNo: "22EC115",
    name: "Pooja Sundaram",
    email: "pooja.sundaram@college.edu.in",
    department: "Electronics & Comm",
    year: 3,
    semester: 5,
    section: "A",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    mentor: "Prof. S. Narayanan",
    cgpa: 7.85,
    activeBacklogs: 0,
    clearedBacklogs: 0,
    overallAttendance: 84.0,
    recentAbsenceStreak: 0,
    lmsEngagementScore: 78,
    assignmentSubmissionRate: 88,
    codingProfile: {
      byteXlScore: 74,
      problemsSolved: 180,
      githubCommitsThisMonth: 18,
      dsaProficiency: 72,
      sqlProficiency: 76,
      webDevProficiency: 68
    },
    kpmgReadinessScore: 79,
    placementEligibility: "Eligible",
    riskScore: 24,
    riskLevel: "Low",
    riskFactors: [
      "Moderate software coding pace compared to CSE peers"
    ],
    academicRecords: [
      {
        semester: 4,
        sgpa: 7.9,
        credits: 22,
        backlogs: 0,
        subjects: [
          { code: "EC401", name: "Signals & Systems", grade: "B+", marks: 76, maxMarks: 100, attendancePercent: 86, status: "Pass" },
          { code: "EC402", name: "Microprocessors & Microcontrollers", grade: "A", marks: 82, maxMarks: 100, attendancePercent: 88, status: "Pass" },
          { code: "EC403", name: "Analog Communication", grade: "B", marks: 74, maxMarks: 100, attendancePercent: 82, status: "Pass" }
        ]
      }
    ],
    skillBenchmarks: [
      { category: "Data Structures & Algorithms", score: 72, percentile: 75, status: "Average" },
      { category: "Database & SQL", score: 76, percentile: 79, status: "Strong" },
      { category: "Embedded / Hardware", score: 85, percentile: 88, status: "Strong" },
      { category: "Analytical & Aptitude", score: 80, percentile: 83, status: "Strong" },
      { category: "Communication & Soft Skills", score: 82, percentile: 86, status: "Strong" }
    ],
    interventions: []
  },
  {
    id: "STU-2026-005",
    rollNo: "22CS142",
    name: "Vikramaditya Roy",
    email: "vikram.roy@college.edu.in",
    department: "Computer Science",
    year: 3,
    semester: 5,
    section: "B",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    mentor: "Dr. Ramesh Babu",
    cgpa: 5.15,
    activeBacklogs: 4,
    clearedBacklogs: 2,
    overallAttendance: 54.2,
    recentAbsenceStreak: 7,
    lmsEngagementScore: 25,
    assignmentSubmissionRate: 40,
    codingProfile: {
      byteXlScore: 28,
      problemsSolved: 24,
      githubCommitsThisMonth: 0,
      dsaProficiency: 22,
      sqlProficiency: 30,
      webDevProficiency: 35
    },
    kpmgReadinessScore: 32,
    placementEligibility: "Ineligible",
    riskScore: 92,
    riskLevel: "Critical",
    riskFactors: [
      "Critically low attendance (54.2%) — detention risk imminent",
      "4 active backlogs across Sem 3 & 4 (Operating Systems, Computer Networks, DAA, Mathematics III)",
      "Consecutive 7-day absence streak with uncontactable status",
      "Zero GitHub activity in past 4 weeks"
    ],
    academicRecords: [
      {
        semester: 4,
        sgpa: 4.8,
        credits: 22,
        backlogs: 2,
        subjects: [
          { code: "CS401", name: "Design & Analysis of Algorithms", grade: "F", marks: 24, maxMarks: 100, attendancePercent: 52, status: "Fail" },
          { code: "CS402", name: "Operating Systems", grade: "F", marks: 28, maxMarks: 100, attendancePercent: 48, status: "Fail" }
        ]
      }
    ],
    skillBenchmarks: [
      { category: "Data Structures & Algorithms", score: 22, percentile: 14, status: "Needs Improvement" },
      { category: "Database & SQL", score: 30, percentile: 22, status: "Needs Improvement" },
      { category: "Analytical & Aptitude", score: 35, percentile: 25, status: "Needs Improvement" }
    ],
    interventions: [
      {
        id: "INT-103",
        studentId: "STU-2026-005",
        date: "2026-10-02",
        type: "Parent Notification",
        mentorName: "Dr. Ramesh Babu",
        notes: "Parent contacted via phone regarding impending attendance detention. Meeting scheduled for Friday.",
        actionItems: ["Parent in-person counseling session", "Undertaking letter for 85% attendance", "Remedial lab enrollment"],
        status: "Escalated",
        followUpDate: "2026-10-09"
      }
    ]
  },
  {
    id: "STU-2026-006",
    rollNo: "22AI122",
    name: "Ananya Iyer",
    email: "ananya.iyer@college.edu.in",
    department: "AI & Data Science",
    year: 3,
    semester: 5,
    section: "B",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    mentor: "Dr. Vikram Seth",
    cgpa: 8.42,
    activeBacklogs: 0,
    clearedBacklogs: 0,
    overallAttendance: 88.5,
    recentAbsenceStreak: 0,
    lmsEngagementScore: 91,
    assignmentSubmissionRate: 94,
    codingProfile: {
      byteXlScore: 86,
      problemsSolved: 260,
      githubCommitsThisMonth: 34,
      dsaProficiency: 82,
      sqlProficiency: 90,
      webDevProficiency: 85
    },
    kpmgReadinessScore: 89,
    placementEligibility: "Eligible",
    riskScore: 12,
    riskLevel: "Exemplary",
    riskFactors: [],
    academicRecords: [
      {
        semester: 4,
        sgpa: 8.6,
        credits: 22,
        backlogs: 0,
        subjects: [
          { code: "AI401", name: "Deep Learning Foundations", grade: "A", marks: 87, maxMarks: 100, attendancePercent: 91, status: "Pass" },
          { code: "AI402", name: "Cloud & MLOps", grade: "A+", marks: 91, maxMarks: 100, attendancePercent: 88, status: "Pass" }
        ]
      }
    ],
    skillBenchmarks: [
      { category: "Data Structures & Algorithms", score: 82, percentile: 89, status: "Strong" },
      { category: "Database & SQL", score: 90, percentile: 94, status: "Strong" },
      { category: "Analytical & Aptitude", score: 88, percentile: 91, status: "Strong" },
      { category: "Communication & Soft Skills", score: 92, percentile: 95, status: "Strong" }
    ],
    interventions: []
  },
  {
    id: "STU-2026-007",
    rollNo: "22IT133",
    name: "Karthik Reddy",
    email: "karthik.reddy@college.edu.in",
    department: "Information Technology",
    year: 3,
    semester: 5,
    section: "A",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    mentor: "Prof. Anjali Verma",
    cgpa: 6.98,
    activeBacklogs: 0,
    clearedBacklogs: 2,
    overallAttendance: 76.2,
    recentAbsenceStreak: 1,
    lmsEngagementScore: 68,
    assignmentSubmissionRate: 74,
    codingProfile: {
      byteXlScore: 65,
      problemsSolved: 110,
      githubCommitsThisMonth: 8,
      dsaProficiency: 58,
      sqlProficiency: 74,
      webDevProficiency: 70
    },
    kpmgReadinessScore: 69,
    placementEligibility: "Eligible",
    riskScore: 38,
    riskLevel: "Low",
    riskFactors: [
      "DSA proficiency (58%) requires boost for Tier-1 coding tests",
      "Near borderline CGPA (6.98) for corporate 7.0 cutoff"
    ],
    academicRecords: [],
    skillBenchmarks: [
      { category: "Data Structures & Algorithms", score: 58, percentile: 55, status: "Average" },
      { category: "Database & SQL", score: 74, percentile: 77, status: "Strong" },
      { category: "Analytical & Aptitude", score: 71, percentile: 72, status: "Average" }
    ],
    interventions: []
  },
  {
    id: "STU-2026-008",
    rollNo: "22EC144",
    name: "Divya Nair",
    email: "divya.nair@college.edu.in",
    department: "Electronics & Comm",
    year: 3,
    semester: 5,
    section: "B",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    mentor: "Prof. S. Narayanan",
    cgpa: 6.12,
    activeBacklogs: 2,
    clearedBacklogs: 0,
    overallAttendance: 68.0,
    recentAbsenceStreak: 3,
    lmsEngagementScore: 50,
    assignmentSubmissionRate: 62,
    codingProfile: {
      byteXlScore: 48,
      problemsSolved: 65,
      githubCommitsThisMonth: 4,
      dsaProficiency: 44,
      sqlProficiency: 52,
      webDevProficiency: 50
    },
    kpmgReadinessScore: 51,
    placementEligibility: "Ineligible",
    riskScore: 64,
    riskLevel: "Moderate",
    riskFactors: [
      "Attendance deficit (68%) below required 75%",
      "2 core electronics and programming backlogs",
      "Needs placement criteria recovery plan"
    ],
    academicRecords: [],
    skillBenchmarks: [
      { category: "Data Structures & Algorithms", score: 44, percentile: 38, status: "Needs Improvement" },
      { category: "Database & SQL", score: 52, percentile: 50, status: "Average" }
    ],
    interventions: [
      {
        id: "INT-104",
        studentId: "STU-2026-008",
        date: "2026-09-30",
        type: "Academic Tutoring",
        mentorName: "Prof. S. Narayanan",
        notes: "Discussed backlogs in Analog circuits. Student requested peer tutor assistance.",
        actionItems: ["Assigned peer tutor (Pooja Sundaram)", "Weekly progress quiz"],
        status: "In Progress",
        followUpDate: "2026-10-18"
      }
    ]
  }
];

class Database {
  private students: Student[];
  private interventions: Intervention[];

  constructor() {
    this.students = [...initialStudents];
    this.interventions = initialStudents.flatMap(s => s.interventions);
  }

  // Calculate dynamic risk score based on institutional multi-factor formula
  public computeRisk(student: Partial<Student>): { score: number; level: Student['riskLevel']; factors: string[] } {
    let score = 0;
    const factors: string[] = [];

    // Factor 1: Attendance (Weight: 30%)
    const att = student.overallAttendance ?? 80;
    if (att < 60) {
      score += 30;
      factors.push(`Severe attendance deficit (${att.toFixed(1)}%), critical detention risk`);
    } else if (att < 75) {
      score += 20;
      factors.push(`Attendance (${att.toFixed(1)}%) below 75% placement and exam threshold`);
    } else if (att < 80) {
      score += 10;
      factors.push(`Attendance (${att.toFixed(1)}%) in borderline range`);
    }

    // Factor 2: Active Backlogs (Weight: 30%)
    const backlogs = student.activeBacklogs ?? 0;
    if (backlogs >= 3) {
      score += 30;
      factors.push(`${backlogs} active backlogs posing graduation and placement block`);
    } else if (backlogs === 2) {
      score += 20;
      factors.push(`2 active backlogs requiring immediate remedial exam clearance`);
    } else if (backlogs === 1) {
      score += 10;
      factors.push(`1 active backlog; requires scheduled re-attempt`);
    }

    // Factor 3: CGPA (Weight: 20%)
    const cgpa = student.cgpa ?? 7.0;
    if (cgpa < 6.0) {
      score += 20;
      factors.push(`CGPA (${cgpa.toFixed(2)}) below university academic warning cutoff (6.0)`);
    } else if (cgpa < 7.0) {
      score += 12;
      factors.push(`CGPA (${cgpa.toFixed(2)}) below KPMG Tier-1 placement cutoff (7.0)`);
    } else if (cgpa < 7.5) {
      score += 5;
    }

    // Factor 4: LMS Engagement & Assignments (Weight: 10%)
    const lms = student.lmsEngagementScore ?? 70;
    const assign = student.assignmentSubmissionRate ?? 75;
    if (lms < 40 || assign < 50) {
      score += 10;
      factors.push(`Low LMS digital engagement (${lms}%) and assignment submission rate (${assign}%)`);
    } else if (lms < 60 || assign < 70) {
      score += 5;
    }

    // Factor 5: Technical Skill Benchmark (Weight: 10%)
    const coding = student.codingProfile?.byteXlScore ?? 60;
    if (coding < 40) {
      score += 10;
      factors.push(`Technical skill benchmark lagging at ${coding}/100`);
    } else if (coding < 60) {
      score += 5;
    }

    // Cap between 0 and 100
    score = Math.min(100, Math.max(0, score));

    let level: Student['riskLevel'] = 'Low';
    if (score >= 70) level = 'Critical';
    else if (score >= 40) level = 'Moderate';
    else if (score >= 20) level = 'Low';
    else level = 'Exemplary';

    return { score, level, factors };
  }

  private adminAccount: { email: string; name: string; createdAt: string } | null = {
    email: 'admin@atomis.edu',
    name: 'Dean Administrator',
    createdAt: new Date().toISOString(),
  };

  public getAdminAccount() {
    return this.adminAccount;
  }

  public registerAdminAccount(email: string, name: string): { success: boolean; error?: string } {
    if (this.adminAccount) {
      return { success: false, error: 'An admin account already exists. Please choose another account type.' };
    }
    this.adminAccount = { email, name, createdAt: new Date().toISOString() };
    return { success: true };
  }

  public getStudents(): Student[] {
    return this.students;
  }

  public getStudentById(id: string): Student | undefined {
    return this.students.find(s => s.id === id || s.rollNo.toLowerCase() === id.toLowerCase());
  }

  public addStudent(data: Omit<Student, 'id' | 'riskScore' | 'riskLevel' | 'riskFactors'>): Student {
    const risk = this.computeRisk(data);
    const newStudent: Student = {
      ...data,
      id: `STU-2026-${String(this.students.length + 1).padStart(3, '0')}`,
      riskScore: risk.score,
      riskLevel: risk.level,
      riskFactors: risk.factors,
      interventions: [],
      academicRecords: data.academicRecords || [],
      skillBenchmarks: data.skillBenchmarks || []
    };
    this.students.unshift(newStudent);
    return newStudent;
  }

  public updateStudent(id: string, updates: Partial<Student>): Student | null {
    const index = this.students.findIndex(s => s.id === id);
    if (index === -1) return null;

    const merged = { ...this.students[index], ...updates };
    const risk = this.computeRisk(merged);
    merged.riskScore = risk.score;
    merged.riskLevel = risk.level;
    merged.riskFactors = risk.factors;

    this.students[index] = merged;
    return merged;
  }

  public deleteStudent(id: string): boolean {
    const prevLength = this.students.length;
    this.students = this.students.filter(s => s.id !== id);
    return this.students.length < prevLength;
  }

  public addIntervention(studentId: string, interventionData: Omit<Intervention, 'id' | 'studentId'>): Intervention | null {
    const student = this.getStudentById(studentId);
    if (!student) return null;

    const newIntervention: Intervention = {
      ...interventionData,
      id: `INT-${Date.now().toString().slice(-4)}`,
      studentId: student.id
    };

    student.interventions.unshift(newIntervention);
    this.interventions.unshift(newIntervention);

    // Updating intervention may improve student risk slightly if resolved
    if (newIntervention.status === 'Resolved') {
      student.riskScore = Math.max(5, student.riskScore - 12);
      if (student.riskScore < 20) student.riskLevel = 'Exemplary';
      else if (student.riskScore < 40) student.riskLevel = 'Low';
      else if (student.riskScore < 70) student.riskLevel = 'Moderate';
    }

    return newIntervention;
  }

  public updateInterventionStatus(id: string, status: Intervention['status']): Intervention | null {
    const intervention = this.interventions.find(i => i.id === id);
    if (!intervention) return null;
    intervention.status = status;

    // Update in student's array as well
    const student = this.students.find(s => s.id === intervention.studentId);
    if (student) {
      const stuInt = student.interventions.find(i => i.id === id);
      if (stuInt) stuInt.status = status;
    }
    return intervention;
  }

  public getDashboardOverview() {
    const total = this.students.length;
    const critical = this.students.filter(s => s.riskLevel === 'Critical').length;
    const moderate = this.students.filter(s => s.riskLevel === 'Moderate').length;
    const low = this.students.filter(s => s.riskLevel === 'Low').length;
    const exemplary = this.students.filter(s => s.riskLevel === 'Exemplary').length;

    const avgCgpa = (this.students.reduce((acc, s) => acc + s.cgpa, 0) / (total || 1)).toFixed(2);
    const avgAttendance = (this.students.reduce((acc, s) => acc + s.overallAttendance, 0) / (total || 1)).toFixed(1);
    const avgByteXl = Math.round(this.students.reduce((acc, s) => acc + s.codingProfile.byteXlScore, 0) / (total || 1));
    const avgKpmgReadiness = Math.round(this.students.reduce((acc, s) => acc + s.kpmgReadinessScore, 0) / (total || 1));

    const eligibleForPlacement = this.students.filter(s => s.placementEligibility === 'Eligible').length;
    const borderlinePlacement = this.students.filter(s => s.placementEligibility === 'Borderline').length;
    const ineligiblePlacement = this.students.filter(s => s.placementEligibility === 'Ineligible').length;

    // Department Breakdown
    const depts = ['Computer Science', 'Information Technology', 'AI & Data Science', 'Electronics & Comm'] as const;
    const departmentStats = depts.map(dept => {
      const deptStudents = this.students.filter(s => s.department === dept);
      const count = deptStudents.length;
      const deptCritical = deptStudents.filter(s => s.riskLevel === 'Critical').length;
      const deptAvgCgpa = count ? (deptStudents.reduce((a, b) => a + b.cgpa, 0) / count).toFixed(2) : '0';
      const deptAvgAtt = count ? (deptStudents.reduce((a, b) => a + b.overallAttendance, 0) / count).toFixed(1) : '0';
      const deptAvgByteXl = count ? Math.round(deptStudents.reduce((a, b) => a + b.codingProfile.byteXlScore, 0) / count) : 0;
      return {
        name: dept,
        totalStudents: count,
        criticalCount: deptCritical,
        avgCgpa: Number(deptAvgCgpa),
        avgAttendance: Number(deptAvgAtt),
        avgByteXl: deptAvgByteXl,
        riskPercentage: count ? Math.round((deptCritical / count) * 100) : 0
      };
    });

    const activeInterventionsCount = this.students.flatMap(s => s.interventions).filter(i => i.status !== 'Resolved').length;

    return {
      totalStudents: total,
      riskDistribution: {
        critical,
        moderate,
        low,
        exemplary
      },
      averages: {
        cgpa: Number(avgCgpa),
        attendance: Number(avgAttendance),
        byteXlScore: avgByteXl,
        kpmgReadiness: avgKpmgReadiness
      },
      placementStats: {
        eligible: eligibleForPlacement,
        borderline: borderlinePlacement,
        ineligible: ineligiblePlacement,
        eligibilityRate: Math.round((eligibleForPlacement / (total || 1)) * 100)
      },
      departmentStats,
      activeInterventionsCount,
      recentAlerts: this.students
        .filter(s => s.riskLevel === 'Critical' || s.recentAbsenceStreak >= 3)
        .slice(0, 5)
        .map(s => ({
          studentId: s.id,
          name: s.name,
          rollNo: s.rollNo,
          department: s.department,
          riskScore: s.riskScore,
          riskLevel: s.riskLevel,
          attendance: s.overallAttendance,
          backlogs: s.activeBacklogs,
          streak: s.recentAbsenceStreak,
          primaryFactor: s.riskFactors[0] || "Academic Performance Alert"
        }))
    };
  }

  public resetToDefault() {
    this.students = [...initialStudents];
    this.interventions = initialStudents.flatMap(s => s.interventions);
  }
}

export const db = new Database();
