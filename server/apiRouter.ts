import express, { Request, Response, Router } from "express";
import { db, Student } from "./db";
import {
  generateStudentRiskDiagnostic,
  generateRemedialPlan,
  generateMentorAdvisingBrief,
  auditKpmgCareerReadiness,
  askStudentCopilot,
  auditResumeAndPortfolio,
  simulateAcademicTrajectory,
  projectDegreeCompletionPath,
  askAnalystAi
} from "./gemini";

export const apiRouter = Router();

// Middleware for parsing JSON
apiRouter.use(express.json());

// Server-side auth verification middleware for data mutations
const requireAuthMiddleware = (req: Request, res: Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  // If guest is explicitly indicated or absent in protected mutation
  if (!authHeader || authHeader === 'Bearer guest') {
    return res.status(401).json({
      success: false,
      error: "Authentication required. Please sign in to create, edit, or delete campus student records."
    });
  }
  next();
};

// 1. Health check
apiRouter.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    platform: "AI-Powered Student Analytics & Success Platform",
    timestamp: new Date().toISOString(),
    aiEngine: "Gemini 3.8 Flash (Server-Side @google/genai)",
    partner: "ATOMIS Campus Excellence"
  });
});

// 2. Dashboard Analytics Overview
apiRouter.get("/analytics/dashboard", (req: Request, res: Response) => {
  try {
    const data = db.getDashboardOverview();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Students list with filtering and search
apiRouter.get("/students", (req: Request, res: Response) => {
  try {
    let list = db.getStudents();
    const { search, department, riskLevel, placement, sort } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }

    if (department && typeof department === 'string' && department !== 'All') {
      list = list.filter(s => s.department === department);
    }

    if (riskLevel && typeof riskLevel === 'string' && riskLevel !== 'All') {
      list = list.filter(s => s.riskLevel === riskLevel);
    }

    if (placement && typeof placement === 'string' && placement !== 'All') {
      list = list.filter(s => s.placementEligibility === placement);
    }

    if (sort && typeof sort === 'string') {
      switch (sort) {
        case 'risk_desc':
          list.sort((a, b) => b.riskScore - a.riskScore);
          break;
        case 'risk_asc':
          list.sort((a, b) => a.riskScore - b.riskScore);
          break;
        case 'cgpa_desc':
          list.sort((a, b) => b.cgpa - a.cgpa);
          break;
        case 'attendance_asc':
          list.sort((a, b) => a.overallAttendance - b.overallAttendance);
          break;
        case 'bytexl_desc':
          list.sort((a, b) => b.codingProfile.byteXlScore - a.codingProfile.byteXlScore);
          break;
        default:
          list.sort((a, b) => b.riskScore - a.riskScore);
      }
    } else {
      list.sort((a, b) => b.riskScore - a.riskScore);
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Get single student
apiRouter.get("/students/:id", (req: Request, res: Response) => {
  const student = db.getStudentById(req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, error: "Student not found" });
  }
  res.json({ success: true, data: student });
});

// 5. Add new student
apiRouter.post("/students", requireAuthMiddleware, (req: Request, res: Response) => {
  try {
    const student = db.addStudent(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 6. Update student
apiRouter.put("/students/:id", requireAuthMiddleware, (req: Request, res: Response) => {
  try {
    const updated = db.updateStudent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 7. Delete student
apiRouter.delete("/students/:id", requireAuthMiddleware, (req: Request, res: Response) => {
  const deleted = db.deleteStudent(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: "Student not found" });
  }
  res.json({ success: true, message: "Student record removed" });
});

// 8. Add intervention
apiRouter.post("/students/:id/interventions", requireAuthMiddleware, (req: Request, res: Response) => {
  try {
    const intervention = db.addIntervention(req.params.id, req.body);
    if (!intervention) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }
    res.status(201).json({ success: true, data: intervention });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 9. Update intervention status
apiRouter.patch("/interventions/:id", requireAuthMiddleware, (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updated = db.updateInterventionStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Intervention not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 10. AI: Deep Risk Diagnosis
apiRouter.post("/ai/predict-risk", async (req: Request, res: Response) => {
  try {
    const { studentId, studentData } = req.body;
    let student: Student | undefined;

    if (studentId) {
      student = db.getStudentById(studentId);
    } else if (studentData) {
      const risk = db.computeRisk(studentData);
      student = { ...studentData, riskScore: risk.score, riskLevel: risk.level, riskFactors: risk.factors };
    }

    if (!student) {
      return res.status(404).json({ success: false, error: "Student data not provided or found" });
    }

    const diagnosis = await generateStudentRiskDiagnostic(student);
    res.json({ success: true, data: diagnosis });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. AI: Generate Personalized 4-Week Remedial Plan
apiRouter.post("/ai/generate-remedial-plan", async (req: Request, res: Response) => {
  try {
    const { studentId, targetGoal } = req.body;
    const student = db.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }

    const plan = await generateRemedialPlan(student, targetGoal);
    res.json({ success: true, data: plan });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. AI: Generate Mentor Advising Notes or Parent Letter
apiRouter.post("/ai/mentor-note", async (req: Request, res: Response) => {
  try {
    const { studentId, audience } = req.body;
    const student = db.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }

    const brief = await generateMentorAdvisingBrief(student, audience || 'mentor_notes');
    res.json({ success: true, data: brief });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 13. AI: KPMG Career Readiness & Skill Gap Audit
apiRouter.post("/ai/career-audit", async (req: Request, res: Response) => {
  try {
    const { studentId, targetRole } = req.body;
    const student = db.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }

    const audit = await auditKpmgCareerReadiness(student, targetRole || "Technology Consulting Analyst");
    res.json({ success: true, data: audit });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 14. AI: Student Academic Copilot Q&A
apiRouter.post("/ai/student-copilot", async (req: Request, res: Response) => {
  try {
    const { studentId, question } = req.body;
    const student = db.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }

    const reply = await askStudentCopilot(student, question || "What should I focus on this week?");
    res.json({ success: true, data: { reply } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 15. NEW: AI Resume & GitHub Portfolio Audit for KPMG
apiRouter.post("/ai/resume-audit", async (req: Request, res: Response) => {
  try {
    const { studentId, resumeText, targetRole } = req.body;
    const student = db.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }
    const audit = await auditResumeAndPortfolio(student, resumeText, targetRole);
    res.json({ success: true, data: audit });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 16. NEW: Predictive What-If Trajectory Simulator
apiRouter.post("/ai/simulate-scenario", async (req: Request, res: Response) => {
  try {
    const { studentId, simulatedChanges } = req.body;
    const student = db.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }
    const result = await simulateAcademicTrajectory(student, simulatedChanges);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 17. NEW: Degree Completion Path & Graduation Date Projection
apiRouter.post("/ai/degree-completion-path", async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const student = db.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }
    const pathResult = await projectDegreeCompletionPath(student);
    res.json({ success: true, data: pathResult });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 17. NEW: Peer Mentorship Matchmaker
apiRouter.get("/peer-matches", (req: Request, res: Response) => {
  try {
    const allStudents = db.getStudents();
    const mentors = allStudents.filter(s => s.cgpa >= 8.0 && s.activeBacklogs === 0 && s.codingProfile.byteXlScore >= 75);
    const mentees = allStudents.filter(s => s.riskLevel === 'Critical' || s.riskLevel === 'Moderate');

    const matches = mentees.map(mentee => {
      // Find mentor in same department or best skill match
      const matchedMentor = mentors.find(m => m.department === mentee.department) || mentors[0];
      return {
        menteeId: mentee.id,
        menteeName: mentee.name,
        menteeRoll: mentee.rollNo,
        menteeDept: mentee.department,
        menteeRisk: mentee.riskLevel,
        mentorId: matchedMentor?.id,
        mentorName: matchedMentor?.name,
        mentorRoll: matchedMentor?.rollNo,
        mentorScore: matchedMentor?.codingProfile.byteXlScore,
        focusSubject: mentee.department === 'Computer Science' ? 'Data Structures & Algorithms' :
                      mentee.department === 'Information Technology' ? 'Operating Systems' :
                      mentee.department === 'AI & Data Science' ? 'Probability & Statistics' : 'Signals & Circuits',
        recommendedFrequency: '2 sessions / week (1 hr each)'
      };
    });

    res.json({ success: true, data: matches });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 18. NEW: Emergency Alert Dispatcher (WhatsApp / SMS / Email Simulation)
apiRouter.post("/alerts/dispatch", (req: Request, res: Response) => {
  try {
    const { studentId, channel, recipient, message } = req.body;
    const student = db.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }

    const dispatchLog = {
      dispatchId: `DISP-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString(),
      studentName: student.name,
      studentRoll: student.rollNo,
      channel: channel || 'WhatsApp',
      recipient: recipient || 'Parent & Student',
      messagePreview: message.slice(0, 100) + '...',
      status: 'Delivered',
      carrierAck: 'ACK_200_OK_DELIVERED'
    };

    res.json({ success: true, data: dispatchLog });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 19. Batch Import Simulation
apiRouter.post("/students/import-batch", (req: Request, res: Response) => {
  try {
    const { students } = req.body;
    if (!Array.isArray(students)) {
      return res.status(400).json({ success: false, error: "Expected array of students" });
    }
    const addedList: Student[] = [];
    for (const item of students) {
      addedList.push(db.addStudent(item));
    }
    res.json({ success: true, addedCount: addedList.length, data: addedList });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 20. Reset database
apiRouter.post("/data/reset", (req: Request, res: Response) => {
  db.resetToDefault();
  res.json({ success: true, message: "Database reset to benchmark cohort" });
});

// 21. Ask the Analyst AI
apiRouter.post("/analyst", async (req: Request, res: Response) => {
  try {
    const { question, cohortStats } = req.body;
    const answer = await askAnalystAi(question || "Give a general cohort summary", cohortStats);
    res.json({ success: true, answer });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 22. Server-side single admin lock & registration endpoints
apiRouter.get("/auth/admin-status", (req: Request, res: Response) => {
  const admin = db.getAdminAccount();
  res.json({ success: true, hasAdmin: !!admin, adminEmail: admin?.email });
});

apiRouter.post("/auth/register-admin", (req: Request, res: Response) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({ success: false, error: "Email and name are required." });
  }
  const result = db.registerAdminAccount(String(email).trim().toLowerCase(), String(name).trim());
  if (!result.success) {
    return res.status(409).json({ success: false, error: result.error });
  }
  res.json({ success: true });
});


