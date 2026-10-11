import { GoogleGenAI } from "@google/genai";
import { Student } from "./db";

// Initialize the Google GenAI SDK with server-side API key
const apiKey = process.env.GEMINI_API_KEY || "";

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

function safeJsonParse<T>(rawText: string | undefined | null, fallback: T): T {
  if (!rawText) return fallback;
  try {
    let clean = rawText.trim();
    clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.warn("safeJsonParse: Failed to parse JSON, falling back to heuristic default", err);
    return fallback;
  }
}

/**
 * 1. AI-Powered Deep Risk Diagnostic & Explainable Root Cause
 */
export async function generateStudentRiskDiagnostic(student: Student) {
  const prompt = `You are the lead academic success & risk diagnosis AI for the ApexEdu Student Analytics & Success Platform.
Analyze the following engineering student profile:

Name: ${student.name} (Roll: ${student.rollNo}, Branch: ${student.department}, Year: ${student.year}, Sem: ${student.semester})
Current CGPA: ${student.cgpa}
Active Backlogs: ${student.activeBacklogs} (Cleared: ${student.clearedBacklogs})
Overall Attendance: ${student.overallAttendance}% (Recent absence streak: ${student.recentAbsenceStreak} days)
LMS Engagement Score: ${student.lmsEngagementScore}/100, Assignment Submission Rate: ${student.assignmentSubmissionRate}%
Technical Skill Benchmark Score: ${student.codingProfile.byteXlScore}/100 (DSA: ${student.codingProfile.dsaProficiency}%, SQL: ${student.codingProfile.sqlProficiency}%, Web: ${student.codingProfile.webDevProficiency}%)
KPMG Placement Readiness: ${student.kpmgReadinessScore}/100 (Status: ${student.placementEligibility})
Identified System Risk Score: ${student.riskScore}/100 (${student.riskLevel})
Key Risk Flags: ${student.riskFactors.join("; ")}

Provide a structured, clinical diagnosis for college faculty & management in JSON with the following structure:
{
  "clinicalSummary": "Comprehensive 2-3 sentence diagnosis explaining the core root causes behind their academic trajectory.",
  "primaryThreatVector": "e.g., Attendance Disengagement / Core Concept Foundation Deficit / Exam Anxiety / Backlog Compounding",
  "projectedTrajectory": "What happens in the next semester if no intervention occurs vs what is achievable with timely support.",
  "confidenceScore": 88,
  "topDrivers": [
    {"factor": "Name of factor", "severity": "High" | "Medium" | "Low", "observation": "Detailed observation"}
  ],
  "immediateFacultyAction": "Clear instruction for faculty mentor to execute within 48 hours."
}

Return valid JSON only.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3
        }
      });
      const text = response.text || "{}";
      return JSON.parse(text);
    } catch (err) {
      console.error("Gemini API error during risk diagnosis, using fallback engine:", err);
    }
  }

  // Resilient heuristic fallback
  return {
    clinicalSummary: `${student.name} demonstrates ${student.riskLevel === 'Critical' ? 'severe academic jeopardy' : 'performance variation'} predominantly triggered by ${student.overallAttendance < 75 ? `attendance deficit (${student.overallAttendance}%)` : 'academic bottlenecks'} and ${student.activeBacklogs} active backlogs.`,
    primaryThreatVector: student.overallAttendance < 70 ? "Attendance & Engagement Disengagement" : "Backlog Accumulation & Conceptual Gap",
    projectedTrajectory: student.riskLevel === 'Critical' 
      ? "Without structured remediation, high probability of detention in semester examinations and placement ineligibility."
      : "Predictive model indicates potential for CGPA recovery to 7.0+ within 1 semester if coding hours and attendance are reinforced.",
    confidenceScore: 92,
    topDrivers: [
      {
        factor: "Attendance & Consistency",
        severity: student.overallAttendance < 75 ? "High" : "Low",
        observation: `Current rate is ${student.overallAttendance}%. Threshold requirement for university exams is 75%.`
      },
      {
        factor: "Technical & Coding Readiness",
        severity: student.codingProfile.byteXlScore < 50 ? "High" : "Medium",
        observation: `Technical benchmark is ${student.codingProfile.byteXlScore}/100 with ${student.codingProfile.problemsSolved} practice problems solved.`
      },
      {
        factor: "Academic Backlog Weight",
        severity: student.activeBacklogs > 0 ? "High" : "Low",
        observation: `${student.activeBacklogs} pending backlogs obstructing eligibility for KPMG campus placement.`
      }
    ],
    immediateFacultyAction: `Schedule an in-person 1-on-1 counseling session with ${student.mentor} and assign a peer mentor from advanced student cohort.`
  };
}

/**
 * 2. AI Personalized 4-Week Remediation & Study Roadmap
 */
export async function generateRemedialPlan(student: Student, targetGoal?: string) {
  const prompt = `You are an AI Curriculum & Academic Success Coach for engineering students.
Generate a tailored 4-Week Personalized Recovery & Skill Acceleration Plan for:
Student: ${student.name} (${student.department}, Year ${student.year}, Sem ${student.semester})
Current CGPA: ${student.cgpa}, Active Backlogs: ${student.activeBacklogs}
Skill Benchmark: ${student.codingProfile.byteXlScore}/100 (DSA: ${student.codingProfile.dsaProficiency}%)
Target Goal: ${targetGoal || "Clear pending backlogs, raise attendance to >80%, and reach Placement Eligibility benchmark"}

Return JSON format:
{
  "planTitle": "4-Week Rapid Academic & Placement Recovery Plan",
  "focusAreas": ["Area 1", "Area 2", "Area 3"],
  "weeklyMilestones": [
    {
      "week": 1,
      "theme": "Foundation & Backlog Diagnostic",
      "hoursPerWeek": 12,
      "tasks": ["Task 1", "Task 2", "Task 3"],
      "byteXlModules": ["Module recommendation 1", "Module recommendation 2"]
    },
    {
      "week": 2,
      "theme": "Core Problem Solving & Attendance Recovery",
      "hoursPerWeek": 14,
      "tasks": ["Task 1", "Task 2"],
      "byteXlModules": ["Module recommendation"]
    },
    {
      "week": 3,
      "theme": "Mock Assessments & Internal Test Prep",
      "hoursPerWeek": 15,
      "tasks": ["Task 1", "Task 2"],
      "byteXlModules": ["Module recommendation"]
    },
    {
      "week": 4,
      "theme": "Placement Benchmark Readiness & Review",
      "hoursPerWeek": 12,
      "tasks": ["Task 1", "Task 2"],
      "byteXlModules": ["Module recommendation"]
    }
  ],
  "recommendedResources": ["Resource 1", "Resource 2"],
  "kpiTarget": "Achieve 75%+ attendance and minimum 70 technical coding benchmark"
}

Return JSON only.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4
        }
      });
      const text = response.text || "{}";
      return JSON.parse(text);
    } catch (err) {
      console.error("Gemini API error during remedial plan, using fallback:", err);
    }
  }

  return {
    planTitle: `4-Week Tailored Success Acceleration - ${student.name}`,
    focusAreas: [
      "Targeted Backlog Revision & Problem Sets",
      "Daily DSA & Algorithm Coding Sprint",
      "Attendance Recovery & Class Engagement"
    ],
    weeklyMilestones: [
      {
        week: 1,
        theme: "Root Concept Clearance & Habit Alignment",
        hoursPerWeek: 12,
        tasks: [
          "Complete past 3 years university question paper analysis for backlog subjects",
          "Meet with subject professor during designated doubt-clearing office hours",
          "Solve 10 Easy-to-Medium problems on code laboratory platform"
        ],
        byteXlModules: ["Data Structures Foundations: Arrays, Linked Lists & Complexity", "Logic Building in C++/Java"]
      },
      {
        week: 2,
        theme: "Core Subject Intensive & Attendance Tracking",
        hoursPerWeek: 14,
        tasks: [
          "Maintain 100% daily lecture presence to recover overall percentage",
          "Submit all pending LMS lab assignments and micro-projects",
          "Pair with department peer mentor for bi-weekly code review"
        ],
        byteXlModules: ["Recursion & Sorting Algorithms Practice", "SQL Queries & Normalization Essentials"]
      },
      {
        week: 3,
        theme: "Exam Simulation & Mock Tests",
        hoursPerWeek: 15,
        tasks: [
          "Attempt 2 full-length simulated model exams under timed conditions",
          "Target score of 65%+ in internal practice quizzes",
          "Complete 15 medium algorithmic challenges"
        ],
        byteXlModules: ["Trees, Graphs & Dynamic Programming Sprint", "Object Oriented Design Principles"]
      },
      {
        week: 4,
        theme: "Placement Alignment & Readiness Audit",
        hoursPerWeek: 12,
        tasks: [
          "Final mentor progress review meeting with Dr. Ramesh Babu",
          "Attempt Mock Aptitude & Technical Benchmark Assessment",
          "Update LinkedIn and GitHub portfolio with capstone repository"
        ],
        byteXlModules: ["Corporate Technical Interview Readiness Kit", "Aptitude & Analytical Reasoning Drills"]
      }
    ],
    recommendedResources: [
      "Engineering Campus Core Learning Path: 2026 Edition",
      "Department Question Bank & Video Lecture Repository",
      "KPMG India Tech Campus Interview Preparation Guide"
    ],
    kpiTarget: "Raise attendance past 75% cutoff and increase coding benchmark score by +15 points."
  };
}

/**
 * 3. AI Faculty Mentoring & Stakeholder Communication Generator
 */
export async function generateMentorAdvisingBrief(student: Student, audience: 'mentor_notes' | 'parent_letter' | 'student_encouragement') {
  const prompt = `You are an AI Academic Advisor for college faculty.
Student profile:
Name: ${student.name}, Roll: ${student.rollNo}, Branch: ${student.department}
CGPA: ${student.cgpa}, Backlogs: ${student.activeBacklogs}, Attendance: ${student.overallAttendance}%
Risk Level: ${student.riskLevel} (${student.riskScore}/100)
Mentor: ${student.mentor}

Generate an appropriate draft for audience: "${audience}".
Format as JSON:
{
  "subject": "Clear subject line",
  "content": "Professional, empathetic, and action-oriented letter/briefing message with specific references to their attendance and academic standing.",
  "recommendedTalkingPoints": ["Point 1", "Point 2", "Point 3"],
  "followUpAction": "Specific calendar action"
}

Return JSON only.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4
        }
      });
      const text = response.text || "{}";
      return JSON.parse(text);
    } catch (err) {
      console.error("Gemini API error during mentor advising brief:", err);
    }
  }

  if (audience === 'parent_letter') {
    return {
      subject: `Academic Progress & Attendance Update: ${student.name} (${student.rollNo})`,
      content: `Dear Parent/Guardian,\n\nWe are reaching out from the Department of ${student.department} regarding ${student.name}'s current academic semester performance.\n\nAt present, ${student.name}'s attendance stands at ${student.overallAttendance}%, which is currently below the university mandatory requirement of 75%. Additionally, ${student.name} holds ${student.activeBacklogs} active backlog(s) that require prioritized clearance to safeguard their upcoming campus recruitment eligibility with top corporate partners like KPMG.\n\nWe care deeply about your ward's graduation and success. The department has prepared a personalized academic recovery schedule and allocated peer tutoring assistance. We kindly request you to connect with mentor ${student.mentor} at your earliest convenience to review the support plan.\n\nWarm regards,\nDepartment Academic Mentoring Committee`,
      recommendedTalkingPoints: [
        "Acknowledge student's potential while highlighting the strict 75% attendance university rule",
        "Explain available department remedial labs and structured practice tracks",
        "Establish joint home and campus monitoring routine"
      ],
      followUpAction: "Schedule a telephonic or campus meeting before end of week."
    };
  }

  return {
    subject: `Faculty Mentor Counseling Brief: ${student.name}`,
    content: `Counseling Assessment for ${student.name} (${student.rollNo}):\nStudent is currently exhibiting ${student.riskLevel} academic risk index (${student.riskScore}/100). The primary friction points are attendance inconsistency (${student.overallAttendance}%) and ${student.activeBacklogs} unresolved backlogs. When discussing this with the student, adopt an encouraging but firm coaching approach, emphasizing that the placement window opens within 6 months and recovery is fully attainable with disciplined execution.`,
    recommendedTalkingPoints: [
      `Review reasons for recent absence streak (${student.recentAbsenceStreak} days)`,
      "Establish non-negotiable attendance commitment for upcoming 30 days",
      `Enroll student in remedial coding sprint (Current score: ${student.codingProfile.byteXlScore}/100)`
    ],
    followUpAction: "Log an intervention record in the platform and set follow-up date for next fortnight."
  };
}

/**
 * 4. KPMG Placement & Career Competency Readiness Audit
 */
export async function auditKpmgCareerReadiness(student: Student, targetRole: string = "Technology Consulting Analyst") {
  const prompt = `You are a Senior Campus Recruitment & Talent Analytics Director at KPMG in India.
Evaluate this engineering student candidate for the role: "${targetRole}".

Candidate Profile:
Name: ${student.name}, Branch: ${student.department}, Year: ${student.year}
CGPA: ${student.cgpa} (KPMG Cutoff typically 7.0+)
Active Backlogs: ${student.activeBacklogs} (KPMG Policy requires 0 active backlogs at time of joining)
Attendance: ${student.overallAttendance}%
Technical Skill Benchmark: ${student.codingProfile.byteXlScore}/100
DSA Proficiency: ${student.codingProfile.dsaProficiency}/100
SQL/Database Proficiency: ${student.codingProfile.sqlProficiency}/100
Web Dev: ${student.codingProfile.webDevProficiency}/100
GitHub / Coding Projects: ${student.codingProfile.problemsSolved} problems solved, ${student.codingProfile.githubCommitsThisMonth} commits this month.

Return JSON:
{
  "readinessScore": 76,
  "hiringVerdict": "Direct Interview Eligible" | "Borderline - Needs Skill Polish" | "High Barrier - Remediation Needed",
  "kpmgCompetencies": [
    {"competency": "Analytical & Problem Solving", "rating": 80, "benchmark": 75, "status": "Meets Benchmark"},
    {"competency": "Technical Stack & Data Skills", "rating": 65, "benchmark": 70, "status": "Gap Identified"},
    {"competency": "Academic Discipline & Consistency", "rating": 60, "benchmark": 70, "status": "Gap Identified"},
    {"competency": "Communication & Client Orientation", "rating": 78, "benchmark": 70, "status": "Meets Benchmark"}
  ],
  "keyStrengths": ["Strength 1", "Strength 2"],
  "criticalGaps": ["Gap 1", "Gap 2"],
  "recommendedActionItems": [
    "Step 1",
    "Step 2",
    "Step 3"
  ],
  "mockInterviewQuestions": [
    "Question 1",
    "Question 2"
  ]
}

Return JSON only.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3
        }
      });
      const text = response.text || "{}";
      return JSON.parse(text);
    } catch (err) {
      console.error("Gemini API error during KPMG career audit:", err);
    }
  }

  const meetsCgpa = student.cgpa >= 7.0;
  const zeroBacklogs = student.activeBacklogs === 0;
  const verdict = (meetsCgpa && zeroBacklogs && student.codingProfile.byteXlScore >= 70) 
    ? "Direct Interview Eligible" 
    : (student.activeBacklogs <= 1 && student.cgpa >= 6.5) 
      ? "Borderline - Needs Skill Polish" 
      : "High Barrier - Remediation Needed";

  return {
    readinessScore: student.kpmgReadinessScore,
    hiringVerdict: verdict,
    kpmgCompetencies: [
      { competency: "Analytical & Problem Solving", rating: student.codingProfile.dsaProficiency, benchmark: 70, status: student.codingProfile.dsaProficiency >= 70 ? "Meets Benchmark" : "Gap Identified" },
      { competency: "SQL & Relational Data Engineering", rating: student.codingProfile.sqlProficiency, benchmark: 70, status: student.codingProfile.sqlProficiency >= 70 ? "Meets Benchmark" : "Gap Identified" },
      { competency: "Academic Eligibility & Backlog Clearance", rating: zeroBacklogs ? 95 : 40, benchmark: 75, status: zeroBacklogs ? "Meets Benchmark" : "Gap Identified" },
      { competency: "System Architecture & Digital Modernization", rating: student.codingProfile.webDevProficiency, benchmark: 65, status: student.codingProfile.webDevProficiency >= 65 ? "Meets Benchmark" : "Gap Identified" }
    ],
    keyStrengths: [
      `${student.department} foundational coursework`,
      `${student.codingProfile.problemsSolved} practice problems recorded on platform`,
      student.overallAttendance >= 75 ? "Consistent lecture and lab attendance record" : "Strong peer communication skills"
    ],
    criticalGaps: [
      student.activeBacklogs > 0 ? `Must clear ${student.activeBacklogs} active backlogs before recruitment drive commencement.` : "Advanced Data Structures & Algorithms under timed pressure.",
      student.cgpa < 7.0 ? `Current CGPA (${student.cgpa}) is below KPMG standard campus shortlisting threshold of 7.0.` : "Cloud platform exposure (AWS/GCP/Azure)."
    ],
    recommendedActionItems: [
      "Prioritize backlog clearing exams and secure a minimum of Grade 'B' or above",
      "Dedicate 45 minutes daily to SQL and Python data manipulation modules",
      "Build one full-stack enterprise capstone project showcasing clean architecture and unit tests"
    ],
    mockInterviewQuestions: [
      "How would you approach optimizing a slow database query in a multi-tenant client enterprise application?",
      "Walk us through a scenario where a project deadline was at risk and how you communicated trade-offs with stakeholders."
    ]
  };
}

/**
 * 5. Student AI Academic Copilot / Mentor Chat
 */
export async function askStudentCopilot(student: Student, userQuestion: string) {
  const prompt = `You are the AI Academic Copilot & Success Mentor for engineering student ${student.name}.
Student details:
Branch: ${student.department}, Year: ${student.year}, Sem: ${student.semester}
CGPA: ${student.cgpa}, Active Backlogs: ${student.activeBacklogs}, Attendance: ${student.overallAttendance}%
Skill Benchmark Score: ${student.codingProfile.byteXlScore}/100, KPMG Readiness: ${student.kpmgReadinessScore}/100
Key Risk Factors: ${student.riskFactors.join("; ") || "None"}

The student asks you: "${userQuestion}"

Respond with empathetic, highly actionable, practical academic and career advice tailored specifically to their status and the university curriculum. Keep it motivating, structured, and around 150-250 words.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          temperature: 0.6
        }
      });
      return response.text || "I'm here to support your academic journey. Let's work together on your goals.";
    } catch (err) {
      console.error("Gemini API error during student copilot chat:", err);
    }
  }

  return `Hi ${student.name}! I'm tracking your academic standing. With your current CGPA of ${student.cgpa} and ${student.overallAttendance}% attendance, your immediate highest-leverage priority is clearing your ${student.activeBacklogs > 0 ? `${student.activeBacklogs} active backlog(s)` : 'core semester courses'} and pushing your coding skill benchmark from ${student.codingProfile.byteXlScore} to 75+. For campus placement, aim to solve at least 2 DSA problems daily and keep your attendance above 75%. You have strong potential—stay consistent!`;
}

/**
 * 6. NEW FEATURE: AI Resume & GitHub Portfolio Auditor for KPMG Campus Hiring
 */
export async function auditResumeAndPortfolio(student: Student, resumeText: string, targetRole: string = "Technology Consulting Analyst") {
  const prompt = `You are an Executive Campus Hiring Lead auditing a student's resume & GitHub portfolio for "${targetRole}".

Candidate Academic Record:
Name: ${student.name}, CGPA: ${student.cgpa}, Backlogs: ${student.activeBacklogs}, Attendance: ${student.overallAttendance}%
Skill Benchmark: ${student.codingProfile.byteXlScore}/100 (DSA: ${student.codingProfile.dsaProficiency}%, SQL: ${student.codingProfile.sqlProficiency}%)
GitHub Commits This Month: ${student.codingProfile.githubCommitsThisMonth}, Problems Solved: ${student.codingProfile.problemsSolved}

Resume & Project Portfolio Text Provided:
"""${resumeText}"""

Provide a rigorous corporate audit in JSON format:
{
  "atsScore": 82,
  "kpmgFitScore": 78,
  "verdict": "Interview Ready" | "Needs Technical Polish" | "Major Gaps to Address",
  "strengthsFound": ["Strength 1", "Strength 2"],
  "missingKeywords": ["Docker", "Microservices", "REST API", "Unit Testing"],
  "resumeBulletImprovements": [
    {
      "original": "Worked on a web project with React and Node.",
      "improved": "Architected an enterprise dashboard with React 19 and Express, reducing latency by 40% for 500+ active users."
    }
  ],
  "gitHubPortfolioAudit": "Assessment of GitHub repositories, commit frequency, and project complexity.",
  "consultingReadinessNotes": "Notes on how the student communicates business impact and analytical problem solving."
}

Return JSON only.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3
        }
      });
      const text = response.text || "{}";
      return JSON.parse(text);
    } catch (err) {
      console.error("Gemini API error during resume audit:", err);
    }
  }

  return {
    atsScore: 78,
    kpmgFitScore: 74,
    verdict: "Needs Technical Polish",
    strengthsFound: [
      `Solid foundation in ${student.department} coursework`,
      `${student.codingProfile.problemsSolved} coding problems demonstrated on technical practice portal`,
      "Practical project work demonstrated in web/data development"
    ],
    missingKeywords: ["CI/CD Pipeline", "SQL Indexing", "Cloud Architecture (AWS/GCP)", "Agile/Scrum", "Business Impact Metrics"],
    resumeBulletImprovements: [
      {
        original: "Developed a database project using SQL and Python.",
        improved: "Designed and normalized a relational SQL database with 15+ tables; implemented query caching to enhance transaction throughput."
      },
      {
        original: "Participated in college hackathon and built an app.",
        improved: "Led a 4-person team to deliver an AI Student Analytics platform, integrating Gemini APIs and real-time risk scoring."
      }
    ],
    gitHubPortfolioAudit: `${student.codingProfile.githubCommitsThisMonth} commits this month. Needs README documentation with architecture diagrams and live demo links for capstone projects.`,
    consultingReadinessNotes: "Student highlights technical tools well, but should quantify business outcomes, client value, and system efficiency."
  };
}

/**
 * 7. NEW FEATURE: Predictive What-If Academic Scenario Simulator
 */
export async function simulateAcademicTrajectory(student: Student, simulatedChanges: {
  additionalAttendanceClasses: number;
  clearedBacklogsTarget: number;
  targetInternalMarks: number;
  byteXlPracticeHoursPerWeek: number;
}) {
  const currentTotalClasses = 60;
  const currentAttended = (student.overallAttendance / 100) * currentTotalClasses;
  const newTotal = currentTotalClasses + simulatedChanges.additionalAttendanceClasses;
  const newAttended = currentAttended + simulatedChanges.additionalAttendanceClasses;
  const projectedAttendance = Number(Math.min(100, (newAttended / newTotal) * 100).toFixed(1));

  const remainingBacklogs = Math.max(0, student.activeBacklogs - simulatedChanges.clearedBacklogsTarget);
  const projectedByteXl = Math.min(100, Math.round(student.codingProfile.byteXlScore + (simulatedChanges.byteXlPracticeHoursPerWeek * 1.8)));

  const projectedCgpa = Number(Math.min(10, student.cgpa + (simulatedChanges.targetInternalMarks > 75 ? 0.4 : 0.1)).toFixed(2));

  let projectedRisk = 0;
  if (projectedAttendance < 60) projectedRisk += 30;
  else if (projectedAttendance < 75) projectedRisk += 20;
  else if (projectedAttendance < 80) projectedRisk += 10;

  if (remainingBacklogs >= 3) projectedRisk += 30;
  else if (remainingBacklogs === 2) projectedRisk += 20;
  else if (remainingBacklogs === 1) projectedRisk += 10;

  if (projectedCgpa < 6.0) projectedRisk += 20;
  else if (projectedCgpa < 7.0) projectedRisk += 12;

  if (projectedByteXl < 40) projectedRisk += 10;
  else if (projectedByteXl < 60) projectedRisk += 5;

  projectedRisk = Math.min(100, Math.max(0, projectedRisk));

  let projectedLevel = 'Low';
  if (projectedRisk >= 70) projectedLevel = 'Critical';
  else if (projectedRisk >= 40) projectedLevel = 'Moderate';
  else if (projectedRisk < 20) projectedLevel = 'Exemplary';

  const kpmgEligibility = (projectedCgpa >= 7.0 && remainingBacklogs === 0 && projectedAttendance >= 75)
    ? 'Eligible'
    : (remainingBacklogs <= 1 && projectedCgpa >= 6.5)
      ? 'Borderline'
      : 'Ineligible';

  return {
    projectedAttendance,
    projectedCgpa,
    remainingBacklogs,
    projectedByteXl,
    projectedRisk,
    projectedLevel,
    kpmgEligibility,
    attendanceDelta: Number((projectedAttendance - student.overallAttendance).toFixed(1)),
    riskDelta: student.riskScore - projectedRisk,
    advice: remainingBacklogs === 0 && projectedAttendance >= 75
      ? "Scenario projects 100% eligibility restoration for KPMG campus hiring!"
      : "Positive recovery trajectory. Prioritize remaining backlogs to reach Tier-1 eligibility."
  };
}

/**
 * 8. NEW FEATURE: AI Degree Completion Path & Graduation Date Projection
 */
export async function projectDegreeCompletionPath(student: Student) {
  // Compute baseline metrics
  const totalCreditsRequired = 160;
  const creditsPerSem = 20;
  const semsCompleted = Math.max(1, student.semester - 1);
  const totalSubjectAttempts = student.academicRecords.flatMap(r => r.subjects).length || 10;
  const passedSubjects = student.academicRecords.flatMap(r => r.subjects).filter(s => s.status === 'Pass').length || 8;
  const historicalPassRate = Math.round((passedSubjects / totalSubjectAttempts) * 100);

  const backlogCreditsPending = student.activeBacklogs * 4;
  const creditsEarned = Math.max(20, (semsCompleted * creditsPerSem) - backlogCreditsPending);
  const remainingRegularCredits = Math.max(0, totalCreditsRequired - (semsCompleted * creditsPerSem));

  const gradYear = 2026 + (4 - student.year);
  const standardGraduationDate = `May ${gradYear}`;

  const prompt = `You are the Chief Academic Registrar and AI Degree Progress Analytics Officer for an engineering university.
Evaluate this student's degree completion trajectory and backlog credit clearance:

Student Profile:
Name: ${student.name} (${student.rollNo}, ${student.department})
Current Academic Standing: Year ${student.year}, Semester ${student.semester} of 8
CGPA: ${student.cgpa}/10.0, Overall Attendance: ${student.overallAttendance}%
Active Backlogs: ${student.activeBacklogs} (${backlogCreditsPending} pending backlog credits)
Cleared Backlogs: ${student.clearedBacklogs}
Historical Course Pass Rate: ${historicalPassRate}%
Total Required Credits for B.Tech Degree: ${totalCreditsRequired}
Earned Credits to Date: ${creditsEarned}
Pending Regular Semester Credits to Graduate: ${remainingRegularCredits}
Standard Cohort Graduation Date: ${standardGraduationDate}

Given university constraints (Maximum 24 credits per regular semester, maximum 8 credits per supplementary/remedial summer term):
1. Compute the projected graduation date based on backlog credit load and historical pass velocity.
2. Determine if graduation is "On-Track", "At-Risk (1 Term Delay)", or "Critical Delay (1+ Years)".
3. Formulate a term-by-term credit clearance roadmap from current semester to degree completion.
4. Identify any critical prerequisite chokepoint subjects that block subsequent electives or final year capstone.
5. Provide actionable fast-track acceleration strategies (e.g. Summer term remedial registration, NPTEL credit transfer, weekly subject clinics).

Format output strictly as JSON with this schema:
{
  "projectedGraduationDate": "May ${gradYear}" | "December ${gradYear}" | "May ${gradYear + 1}",
  "standardGraduationDate": "${standardGraduationDate}",
  "graduationStatus": "On-Track" | "At-Risk (1 Term Delay)" | "Critical Delay (1+ Years)",
  "onTimeCompletionProbability": 82,
  "totalCreditsRequired": 160,
  "creditsEarned": ${creditsEarned},
  "backlogCreditsPending": ${backlogCreditsPending},
  "remainingRegularCredits": ${remainingRegularCredits},
  "historicalPassRate": ${historicalPassRate},
  "creditRecoveryVelocity": "20 regular credits/term + up to 4 backlog credits per supplementary cycle",
  "termMilestones": [
    {
      "termName": "e.g., Fall 2026 (Sem 5 - Current)",
      "semesterNumber": 5,
      "regularCredits": 20,
      "backlogCreditsScheduled": 4,
      "totalCredits": 24,
      "status": "In Progress" | "Completed" | "Projected Regular" | "Projected Remedial" | "Degree Conferred",
      "focusSubjects": ["Subject 1", "Subject 2"],
      "projectedPassRate": 85,
      "milestoneKey": "sem-5"
    }
  ],
  "criticalBacklogChokepoints": [
    {
      "subjectName": "Design & Analysis of Algorithms",
      "credits": 4,
      "prerequisiteFor": "Advanced Algorithms & Capstone Project",
      "recommendedAttemptTerm": "Immediate Supplementary Term"
    }
  ],
  "accelerationStrategies": [
    "Strategy 1",
    "Strategy 2",
    "Strategy 3"
  ],
  "aiAdvisorVerdict": "Summary assessment of graduation probability and key counsel."
}

Return JSON only.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3
        }
      });
      const text = response.text || "{}";
      const parsed = safeJsonParse(text, null);
      if (parsed) return parsed;
    } catch (err) {
      console.error("Gemini API error during degree completion path, using fallback:", err);
    }
  }

  // Resilient heuristic projection fallback
  const isDelayed = student.activeBacklogs >= 3 || (student.activeBacklogs >= 2 && historicalPassRate < 70);
  const projectedGraduationDate = isDelayed ? `December ${gradYear}` : standardGraduationDate;
  const graduationStatus = student.activeBacklogs === 0 ? "On-Track" : isDelayed ? "At-Risk (1 Term Delay)" : "On-Track";
  const onTimeCompletionProbability = student.activeBacklogs === 0 ? 96 : Math.max(30, 90 - (student.activeBacklogs * 18));

  return {
    projectedGraduationDate,
    standardGraduationDate,
    graduationStatus,
    onTimeCompletionProbability,
    totalCreditsRequired,
    creditsEarned,
    backlogCreditsPending,
    remainingRegularCredits,
    historicalPassRate,
    creditRecoveryVelocity: "20 regular credits/term + 4 backlog credits per supplementary session",
    termMilestones: [
      {
        termName: `Fall 2026 (Sem ${student.semester} - Current)`,
        semesterNumber: student.semester,
        regularCredits: 20,
        backlogCreditsScheduled: Math.min(4, backlogCreditsPending),
        totalCredits: 20 + Math.min(4, backlogCreditsPending),
        status: "In Progress",
        focusSubjects: [student.department + " Core Practicum", "Theory of Computation"],
        projectedPassRate: Math.max(65, historicalPassRate),
        milestoneKey: `sem-${student.semester}`
      },
      {
        termName: `Spring 2027 (Sem ${student.semester + 1})`,
        semesterNumber: student.semester + 1,
        regularCredits: 20,
        backlogCreditsScheduled: Math.max(0, backlogCreditsPending - 4),
        totalCredits: 20 + Math.max(0, backlogCreditsPending - 4),
        status: "Projected Regular",
        focusSubjects: ["Enterprise Cloud Systems", "Elective I"],
        projectedPassRate: 80,
        milestoneKey: `sem-${student.semester + 1}`
      },
      {
        termName: `Summer 2027 (Accelerated Remedial Term)`,
        semesterNumber: student.semester + 1,
        regularCredits: 0,
        backlogCreditsScheduled: Math.min(4, backlogCreditsPending),
        totalCredits: Math.min(4, backlogCreditsPending),
        status: "Projected Remedial",
        focusSubjects: ["Fast-Track Supplementary Labs"],
        projectedPassRate: 90,
        milestoneKey: "summer-2027"
      },
      {
        termName: `Fall 2027 (Sem ${student.semester + 2})`,
        semesterNumber: student.semester + 2,
        regularCredits: 20,
        backlogCreditsScheduled: 0,
        totalCredits: 20,
        status: "Projected Regular",
        focusSubjects: ["Machine Learning & Capstone Phase I"],
        projectedPassRate: 88,
        milestoneKey: `sem-${student.semester + 2}`
      },
      {
        termName: `Spring 2028 (Sem 8 - Final Degree Term)`,
        semesterNumber: 8,
        regularCredits: 16,
        backlogCreditsScheduled: 0,
        totalCredits: 16,
        status: "Degree Conferred",
        focusSubjects: ["Major Project & Industry Internship"],
        projectedPassRate: 95,
        milestoneKey: "sem-8"
      }
    ],
    criticalBacklogChokepoints: student.activeBacklogs > 0 ? [
      {
        subjectName: student.academicRecords[0]?.subjects?.find(s => s.status === 'Fail')?.name || "Design & Analysis of Algorithms",
        credits: 4,
        prerequisiteFor: "Advanced Computing Electives & KPMG Placement Clearance",
        recommendedAttemptTerm: "Immediate Supplementary Examination"
      }
    ] : [],
    accelerationStrategies: [
      "Enroll in University Summer Fast-Track Term to clear 4 credits without overloading regular semester credits.",
      "Utilize NPTEL / SWAYAM MOOC credit transfer for 1 elective subject to relieve coursework pressure.",
      "Attend department mandatory bi-weekly remedial clinics with assigned faculty mentor."
    ],
    aiAdvisorVerdict: student.activeBacklogs > 0 
      ? `Student holds ${student.activeBacklogs} backlogs (${backlogCreditsPending} credits). With structured supplementary enrollment, student can maintain an on-time degree completion rate of ${onTimeCompletionProbability}%.`
      : `Student is in exemplary standing with zero credit deficit, on track for conferral in ${standardGraduationDate}.`
  };
}

/**
 * 9. Ask the Analyst AI Assistant (EduPulse Platform)
 */
export async function askAnalystAi(question: string, cohortStats: any): Promise<string> {
  const fallback = `Based on the active cohort data (${cohortStats?.totalCount || 300} students in ${cohortStats?.department || 'All'} departments):
• At-Risk Count: ${cohortStats?.highRiskCount || 42} students require immediate faculty intervention.
• Key Drivers: High active backlog accumulation combined with attendance falling below the 75% cutoff.
• Recommended Action: Assign targeted remedial coaching and schedule counselor meetings.`;

  if (!ai) return fallback;

  try {
    const prompt = `You are the chief academic data analyst and student success AI for the EduPulse Higher Education Analytics Platform.
The user is a college dean or faculty member asking:
"${question}"

Here is the current filtered cohort data context:
- Total students in view: ${cohortStats?.totalCount}
- High-risk students: ${cohortStats?.highRiskCount}
- Academic risk students: ${cohortStats?.academicRiskCount}
- Placement risk students: ${cohortStats?.placementRiskCount}
- Filtered Department: ${cohortStats?.department}
- Filtered Year: ${cohortStats?.year}
- Sample at-risk profiles:
${JSON.stringify(cohortStats?.sampleStudents || [], null, 2)}

Provide a concise, professional, data-backed 2-3 paragraph answer with bullet points highlighting root causes, student names if applicable, and specific faculty action items.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text?.trim() || fallback;
  } catch (err) {
    console.warn("askAnalystAi error:", err);
    return fallback;
  }
}


