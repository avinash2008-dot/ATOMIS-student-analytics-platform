import {
  RawAcademicRecord,
  RawAttendanceRecord,
  RawLmsRecord,
  RawEngagementRecord,
  RawPlacementRecord,
  RawSkillsRecord,
  RawFeedbackRecord,
  Department,
  SubjectScore,
} from './studentTypes';

// Seeded pseudo-random number generator for 100% reproducible data
function createRng(seed = 1024) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const DEPARTMENTS: Department[] = ['CSE', 'ECE', 'MECH', 'CIVIL'];

const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Aditi', 'Rahul', 'Pooja', 'Vikram', 'Sneha',
  'Kavya', 'Siddharth', 'Meera', 'Arjun', 'Diya', 'Karan', 'Isha', 'Varun',
  'Tanvi', 'Manish', 'Riya', 'Nikhil', 'Priyanka', 'Dev', 'Shreya', 'Gaurav',
  'Divya', 'Sanjay', 'Neha', 'Pranav', 'Roshni', 'Akash', 'Swati', 'Harsh'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Reddy', 'Iyer', 'Nair', 'Singh', 'Chopra',
  'Mehta', 'Joshi', 'Gupta', 'Rao', 'Babu', 'Kumar', 'Das', 'Menon',
  'Bhat', 'Deshmukh', 'Saxena', 'Kulkarni', 'Malhotra', 'Banerjee', 'Pillai'
];

const SUBJECT_CATALOG: Record<Department, string[]> = {
  CSE: ['Algorithms & Data Structures', 'Operating Systems', 'Database Systems', 'Computer Networks', 'Machine Learning'],
  ECE: ['Signals & Systems', 'Digital Electronics', 'VLSI Design', 'Microprocessors', 'Communication Theory'],
  MECH: ['Thermodynamics', 'Fluid Mechanics', 'Strength of Materials', 'Machine Design', 'Robotics'],
  CIVIL: ['Structural Analysis', 'Geotechnical Eng', 'Surveying & GIS', 'Concrete Technology', 'Hydrology'],
};

export interface RawSourceTables {
  academic: RawAcademicRecord[];
  attendance: RawAttendanceRecord[];
  lms: RawLmsRecord[];
  engagement: RawEngagementRecord[];
  placement: RawPlacementRecord[];
  skills: RawSkillsRecord[];
  feedback: RawFeedbackRecord[];
}

export function generateSyntheticDataset(seed = 2026): RawSourceTables {
  const rng = createRng(seed);
  const totalStudents = 300;

  const academic: RawAcademicRecord[] = [];
  const attendance: RawAttendanceRecord[] = [];
  const lms: RawLmsRecord[] = [];
  const engagement: RawEngagementRecord[] = [];
  const placement: RawPlacementRecord[] = [];
  const skills: RawSkillsRecord[] = [];
  const feedback: RawFeedbackRecord[] = [];

  for (let i = 1; i <= totalStudents; i++) {
    const student_id = `STU-${1000 + i}`;
    const firstName = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
    const name = `${firstName} ${lastName}`;
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const year = ((i % 4) + 1);
    const section = i % 2 === 0 ? 'A' : 'B';

    // Latent student aptitude / engagement factor (0.0 to 1.0) creates believable correlations
    const latentFactor = Math.pow(rng(), 0.85); // slight positive skew
    const isAtRiskProfile = latentFactor < 0.32;

    // 1. Attendance correlated with latent factor
    let rawAttPct = Math.round(50 + latentFactor * 48 + (rng() * 10 - 5));
    // Introduce deliberate outliers & missing values (~5%)
    let maybeAttendance: number | null = rawAttPct;
    if (rng() < 0.04) maybeAttendance = null;
    else if (rng() < 0.02) maybeAttendance = 104; // outlier
    else if (rng() < 0.01) maybeAttendance = -2;  // outlier

    const subjectAttendance: Record<string, number> = {};
    const subjects: SubjectScore[] = SUBJECT_CATALOG[dept].map((subjName, idx) => {
      const subjAtt = Math.max(30, Math.min(100, rawAttPct + Math.round(rng() * 14 - 7)));
      subjectAttendance[`SUB-${idx + 1}`] = subjAtt;
      const subjMark = Math.max(25, Math.min(100, Math.round(40 + latentFactor * 55 + (rng() * 12 - 6))));
      return {
        code: `SUB-0${idx + 1}`,
        name: subjName,
        marks: subjMark,
        attendance: subjAtt,
      };
    });

    attendance.push({
      student_id,
      overall_attendance_pct: maybeAttendance,
      subject_attendance: subjectAttendance,
    });

    // 2. Academic: CGPA correlated with attendance & latent factor
    let rawCgpa = Number((4.5 + latentFactor * 5.2 + (rng() * 0.6 - 0.3)).toFixed(2));
    let backlogsCount = isAtRiskProfile ? Math.floor(rng() * 4) + 1 : (rng() < 0.15 ? 1 : 0);
    let maybeCgpa: number | null = rawCgpa;
    if (rng() < 0.04) maybeCgpa = null;
    else if (rng() < 0.015) maybeCgpa = 11.4; // outlier

    academic.push({
      student_id,
      name,
      department: dept,
      year,
      section,
      cgpa: maybeCgpa,
      internal_marks: Math.round(20 + latentFactor * 28),
      exam_marks: Math.round(35 + latentFactor * 62),
      backlogs: rng() < 0.04 ? null : backlogsCount,
      subjects,
    });

    // 3. LMS Record (logins/wk, assignment %, content views)
    const loginsWk = Math.max(0, Math.round(latentFactor * 28 + (rng() * 6 - 3)));
    const assignPct = Math.max(10, Math.min(100, Math.round(35 + latentFactor * 62)));
    const contentViews = Math.round(latentFactor * 180 + rng() * 30);

    lms.push({
      student_id,
      logins_per_week: rng() < 0.05 ? null : loginsWk,
      assignment_completion_pct: rng() < 0.04 ? null : assignPct,
      content_views: rng() < 0.03 ? null : contentViews,
    });

    // 4. Engagement Record
    const events = Math.round(latentFactor * 10 + rng() * 3);
    const clubs = Math.round(latentFactor * 3);
    const hackathons = dept === 'CSE' || dept === 'ECE' ? Math.round(latentFactor * 5 + (rng() > 0.7 ? 1 : 0)) : Math.round(latentFactor * 2);
    const certs = Math.round(latentFactor * 6 + (rng() > 0.8 ? 1 : 0));

    engagement.push({
      student_id,
      events_participated: rng() < 0.04 ? null : events,
      club_memberships: rng() < 0.04 ? null : clubs,
      hackathons_attended: rng() < 0.04 ? null : hackathons,
      certifications_completed: rng() < 0.04 ? null : certs,
    });

    // 5. Placement Record
    const aptitude = Math.max(20, Math.min(100, Math.round(35 + latentFactor * 60 + (rng() * 10 - 5))));
    const coding = dept === 'CSE' || dept === 'ECE' 
      ? Math.max(15, Math.min(100, Math.round(30 + latentFactor * 65 + (rng() * 12 - 6))))
      : Math.max(10, Math.min(95, Math.round(25 + latentFactor * 55 + (rng() * 10 - 5))));
    const mockInterview = Math.max(25, Math.min(100, Math.round(40 + latentFactor * 55)));

    placement.push({
      student_id,
      aptitude_score: rng() < 0.05 ? null : aptitude,
      coding_score: rng() < 0.05 ? null : coding,
      mock_interview_score: rng() < 0.05 ? null : mockInterview,
    });

    // 6. Skills Record
    const techSkill = Math.max(20, Math.min(100, Math.round(35 + latentFactor * 60)));
    const softSkill = Math.max(30, Math.min(100, Math.round(45 + latentFactor * 50)));

    skills.push({
      student_id,
      technical_skill_score: rng() < 0.04 ? null : techSkill,
      soft_skill_score: rng() < 0.04 ? null : softSkill,
    });

    // 7. Feedback Record
    const satisfaction = Math.max(1, Math.min(5, Math.round(2 + latentFactor * 2.8)));
    const facultyRating = Math.max(1, Math.min(5, Math.round(2.2 + latentFactor * 2.6)));

    feedback.push({
      student_id,
      student_satisfaction: rng() < 0.04 ? null : satisfaction,
      faculty_feedback_rating: rng() < 0.04 ? null : facultyRating,
    });
  }

  // Add a few deliberate duplicate records in raw lists to test deduplication pipeline (B1)
  academic.push({ ...academic[12] });
  attendance.push({ ...attendance[45] });
  lms.push({ ...lms[88] });

  return {
    academic,
    attendance,
    lms,
    engagement,
    placement,
    skills,
    feedback,
  };
}
