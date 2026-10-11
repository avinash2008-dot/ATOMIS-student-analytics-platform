import {
  doc,
  getDoc,
  setDoc,
  runTransaction,
  collection,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export interface RegisteredUser {
  id: string;
  uid?: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  provider?: 'google' | 'email';
  isEmailVerified: boolean;
  createdAt: string;

  // Extra fields by role
  rollNumber?: string;       // Student
  department?: string;       // Student, Teacher
  year?: string;             // Student
  employeeId?: string;       // Teacher
  teacherApproval?: 'pending' | 'approved' | 'rejected'; // Teacher
  linkedStudentRoll?: string;// Parent
}

export interface UserAuthSession {
  uid?: string;
  email: string;
  role: UserRole;
  name: string;
  isEmailVerified: boolean;
  department?: string;
  rollNumber?: string;
  employeeId?: string;
  teacherApproval?: 'pending' | 'approved' | 'rejected';
  linkedStudentRoll?: string;
}

export interface AdminLockDoc {
  adminUid: string;
  adminEmail: string;
  adminName: string;
  createdAt: string;
}

const STORAGE_USERS_KEY = 'atomis_registered_users';
const STORAGE_SESSION_KEY = 'atomis_auth_session';
const STORAGE_RATE_LIMIT_KEY = 'atomis_login_rate_limit';
const STORAGE_ADMIN_LOCK_LOCAL = 'atomis_admin_lock_state';

// -------------------------------------------------------------
// Rate Limiting: 5 failed attempts cooldown
// -------------------------------------------------------------
export interface RateLimitState {
  attempts: number;
  lockedUntil: number | null;
}

export function getRateLimitState(email: string): RateLimitState {
  try {
    const raw = localStorage.getItem(`${STORAGE_RATE_LIMIT_KEY}_${email.trim().toLowerCase()}`);
    if (!raw) return { attempts: 0, lockedUntil: null };
    const parsed = JSON.parse(raw);
    if (parsed.lockedUntil && Date.now() > parsed.lockedUntil) {
      // Cooldown expired
      return { attempts: 0, lockedUntil: null };
    }
    return parsed;
  } catch {
    return { attempts: 0, lockedUntil: null };
  }
}

export function recordFailedAttempt(email: string): { attemptsRemaining: number; isLocked: boolean; cooldownSeconds: number } {
  const normEmail = email.trim().toLowerCase();
  const current = getRateLimitState(normEmail);
  const newAttempts = current.attempts + 1;
  const isLocked = newAttempts >= 5;
  const cooldownSeconds = 60; // 60s cooldown after 5 failed attempts
  const lockedUntil = isLocked ? Date.now() + cooldownSeconds * 1000 : null;

  try {
    localStorage.setItem(
      `${STORAGE_RATE_LIMIT_KEY}_${normEmail}`,
      JSON.stringify({ attempts: newAttempts, lockedUntil })
    );
  } catch (err) {
    console.warn('Failed to record rate limit state:', err);
  }

  return {
    attemptsRemaining: Math.max(0, 5 - newAttempts),
    isLocked,
    cooldownSeconds,
  };
}

export function resetFailedAttempts(email: string): void {
  try {
    localStorage.removeItem(`${STORAGE_RATE_LIMIT_KEY}_${email.trim().toLowerCase()}`);
  } catch {
    // ignore
  }
}

// -------------------------------------------------------------
// Local Mock Users fallback for offline evaluation
// -------------------------------------------------------------
const INITIAL_DEMO_USERS: RegisteredUser[] = [
  {
    id: 'usr_admin_default',
    uid: 'uid_admin_dean',
    name: 'Dean Administrator',
    email: 'admin@atomis.edu',
    role: 'admin',
    department: 'Executive Administration',
    password: 'password123',
    provider: 'email',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_teacher_default',
    uid: 'uid_teacher_priya',
    name: 'Prof. Priya Raman',
    email: 'mentor@atomis.edu',
    role: 'teacher',
    department: 'Computer Science',
    employeeId: 'EMP-FAC-884',
    teacherApproval: 'approved',
    password: 'password123',
    provider: 'email',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_student_default',
    uid: 'uid_student_alex',
    name: 'Alex Morgan',
    email: 'alex.morgan@university.edu',
    role: 'student',
    rollNumber: '2026-CSE-001',
    department: 'CSE',
    year: '4',
    password: 'password123',
    provider: 'email',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_parent_default',
    uid: 'uid_parent_sam',
    name: 'Sam Morgan',
    email: 'sam.parent@gmail.com',
    role: 'parent',
    linkedStudentRoll: '2026-CSE-001',
    department: 'Parent Guardian',
    password: 'password123',
    provider: 'email',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  },
];

export function getRegisteredUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    const parsed: RegisteredUser[] = JSON.parse(raw);
    return parsed.length > 0 ? parsed : INITIAL_DEMO_USERS;
  } catch {
    return INITIAL_DEMO_USERS;
  }
}

export function getRegisteredUser(email: string): RegisteredUser | undefined {
  if (!email) return undefined;
  const users = getRegisteredUsers();
  return users.find((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase());
}

export function getCurrentSession(): UserAuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCurrentSession(session: UserAuthSession): void {
  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save session:', err);
  }
}

export function clearCurrentSession(): void {
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
  } catch (err) {
    console.error('Failed to clear session:', err);
  }
}

// -------------------------------------------------------------
// FIRESTORE & SERVER RACE-SAFE SINGLE-ADMIN LOCK
// -------------------------------------------------------------
export async function checkAdminLockExists(): Promise<boolean> {
  // 1. Check server-side status
  try {
    const res = await fetch('/api/auth/admin-status');
    if (res.ok) {
      const data = await res.json();
      if (data.hasAdmin) {
        localStorage.setItem(STORAGE_ADMIN_LOCK_LOCAL, 'true');
        return true;
      }
    }
  } catch (e) {
    // server check skipped or offline
  }

  // 2. Check Firestore
  try {
    const lockRef = doc(db, 'config', 'adminLock');
    const snap = await getDoc(lockRef);
    if (snap.exists()) {
      localStorage.setItem(STORAGE_ADMIN_LOCK_LOCAL, 'true');
      return true;
    }
  } catch (err) {
    // If firestore is offline or fails, check local storage flag
    console.warn('Firestore adminLock check fallback:', err);
  }

  // 3. Check if any local registered user is admin
  const users = getRegisteredUsers();
  const hasLocalAdmin = users.some((u) => u.role === 'admin');
  return hasLocalAdmin || localStorage.getItem(STORAGE_ADMIN_LOCK_LOCAL) === 'true';
}

/**
 * Register Account:
 * Atomically checks and sets admin lock on the server and in Firestore if registering as admin.
 * Only the first admin can ever register.
 */
export async function registerAccount({
  name,
  email,
  password,
  role,
  rollNumber,
  department,
  year,
  employeeId,
  linkedStudentRoll,
  provider = 'email',
}: {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  rollNumber?: string;
  department?: string;
  year?: string;
  employeeId?: string;
  linkedStudentRoll?: string;
  provider?: 'google' | 'email';
}): Promise<{ success: boolean; user?: UserAuthSession; error?: string }> {
  const normEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  // Basic validation
  if (!normEmail || !normEmail.includes('@') || !normEmail.includes('.')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (provider === 'email' && (!password || password.length < 8)) {
    return { success: false, error: 'Password must be at least 8 characters long.' };
  }

  // Check existing user by email
  const existingUser = getRegisteredUser(normEmail);
  if (existingUser) {
    return {
      success: false,
      error: 'An account with this email already exists. Please choose Login Account.',
    };
  }

  // Generate unique UID
  const generatedUid = `uid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // ==============================================================
  // ADMIN LOCK ENFORCEMENT (RACE-SAFE SERVER & FIRESTORE TRANSACTION)
  // ==============================================================
  if (role === 'admin') {
    // 1. Check server-side registration
    try {
      const srvRes = await fetch('/api/auth/register-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normEmail, name: cleanName }),
      });
      if (srvRes.status === 409) {
        const data = await srvRes.json().catch(() => ({}));
        return {
          success: false,
          error: data.error || 'An admin account already exists. Please choose another account type.',
        };
      }
    } catch {
      // server offline fallback
    }

    try {
      const lockRef = doc(db, 'config', 'adminLock');
      const userRef = doc(db, 'users', generatedUid);

      await runTransaction(db, async (transaction) => {
        const lockDoc = await transaction.get(lockRef);
        if (lockDoc.exists()) {
          throw new Error('ADMIN_EXISTS');
        }

        // Atomically create admin lock doc and user doc
        const lockData: AdminLockDoc = {
          adminUid: generatedUid,
          adminEmail: normEmail,
          adminName: cleanName,
          createdAt: new Date().toISOString(),
        };

        const userData: RegisteredUser = {
          id: generatedUid,
          uid: generatedUid,
          name: cleanName,
          email: normEmail,
          role: 'admin',
          department: 'Executive Administration',
          password: password,
          provider,
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
        };

        transaction.set(lockRef, lockData);
        transaction.set(userRef, userData);
      });

      localStorage.setItem(STORAGE_ADMIN_LOCK_LOCAL, 'true');
    } catch (err: any) {
      if (err?.message === 'ADMIN_EXISTS' || err?.message?.includes('ADMIN_EXISTS')) {
        return {
          success: false,
          error: 'An admin account already exists. Please choose another account type.',
        };
      }
      // Check local lock state before fallback
      const localLock = await checkAdminLockExists();
      if (localLock) {
        return {
          success: false,
          error: 'An admin account already exists. Please choose another account type.',
        };
      }
    }
  }

  // Prepare user object
  const newUser: RegisteredUser = {
    id: generatedUid,
    uid: generatedUid,
    name: cleanName,
    email: normEmail,
    role,
    password,
    provider,
    isEmailVerified: provider === 'google', // Google users verified immediately
    createdAt: new Date().toISOString(),
    department: department || (role === 'admin' ? 'Administration' : 'General'),
    rollNumber: role === 'student' ? rollNumber?.trim() : undefined,
    year: role === 'student' ? year : undefined,
    employeeId: role === 'teacher' ? employeeId?.trim() : undefined,
    teacherApproval: role === 'teacher' ? 'pending' : undefined,
    linkedStudentRoll: role === 'parent' ? linkedStudentRoll?.trim() : undefined,
  };

  // Sync to Firestore users collection
  try {
    const userRef = doc(db, 'users', generatedUid);
    await setDoc(userRef, newUser);
  } catch (err) {
    console.warn('Syncing to Firestore collection users:', err);
  }

  // Persist to local users list
  const users = getRegisteredUsers();
  users.push(newUser);
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save to local users:', err);
  }

  const session: UserAuthSession = {
    uid: newUser.uid,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    isEmailVerified: newUser.isEmailVerified,
    department: newUser.department,
    rollNumber: newUser.rollNumber,
    employeeId: newUser.employeeId,
    teacherApproval: newUser.teacherApproval,
    linkedStudentRoll: newUser.linkedStudentRoll,
  };

  saveCurrentSession(session);
  return { success: true, user: session };
}

/**
 * Login Account:
 * Enforces rate limiting (5 attempts cooldown) and generic error message.
 * Never trusts client role choice.
 */
export async function loginAccount({
  email,
  password,
  provider = 'email',
}: {
  email: string;
  password?: string;
  provider?: 'google' | 'email';
}): Promise<{ success: boolean; user?: UserAuthSession; error?: string }> {
  const normEmail = email.trim().toLowerCase();

  if (!normEmail || !normEmail.includes('@')) {
    return { success: false, error: 'Incorrect email or password' };
  }

  // Check rate limit lock
  const rateLimit = getRateLimitState(normEmail);
  if (rateLimit.lockedUntil && Date.now() < rateLimit.lockedUntil) {
    const remainingSec = Math.ceil((rateLimit.lockedUntil - Date.now()) / 1000);
    return {
      success: false,
      error: `Too many failed attempts. Account locked for ${remainingSec}s. Please wait before retrying.`,
    };
  }

  // Retrieve user from Firestore or Local storage
  let matchedUser: RegisteredUser | undefined;

  try {
    const userRef = doc(db, 'users', normEmail);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      matchedUser = snap.data() as RegisteredUser;
    }
  } catch {
    // ignore
  }

  if (!matchedUser) {
    matchedUser = getRegisteredUser(normEmail);
  }

  // Validation
  if (!matchedUser) {
    const rl = recordFailedAttempt(normEmail);
    if (rl.isLocked) {
      return {
        success: false,
        error: `Too many failed attempts. Account locked for ${rl.cooldownSeconds}s.`,
      };
    }
    return { success: false, error: 'Incorrect email or password' };
  }

  if (provider === 'email') {
    if (!password || (matchedUser.password && matchedUser.password !== password)) {
      const rl = recordFailedAttempt(normEmail);
      if (rl.isLocked) {
        return {
          success: false,
          error: `Too many failed attempts. Account locked for ${rl.cooldownSeconds}s.`,
        };
      }
      return { success: false, error: 'Incorrect email or password' };
    }
  }

  // Reset rate limiting on successful login
  resetFailedAttempts(normEmail);

  const session: UserAuthSession = {
    uid: matchedUser.uid || matchedUser.id,
    email: matchedUser.email,
    name: matchedUser.name,
    role: matchedUser.role, // Purely stored role, never client chosen
    isEmailVerified: matchedUser.isEmailVerified,
    department: matchedUser.department,
    rollNumber: matchedUser.rollNumber,
    employeeId: matchedUser.employeeId,
    teacherApproval: matchedUser.teacherApproval,
    linkedStudentRoll: matchedUser.linkedStudentRoll,
  };

  saveCurrentSession(session);
  return { success: true, user: session };
}

// -------------------------------------------------------------
// Teacher Approval List Management (for Admin)
// -------------------------------------------------------------
export function getPendingTeachers(): RegisteredUser[] {
  const users = getRegisteredUsers();
  return users.filter((u) => u.role === 'teacher' && u.teacherApproval === 'pending');
}

export function updateTeacherApproval(email: string, status: 'approved' | 'rejected'): void {
  const users = getRegisteredUsers();
  const updated = users.map((u) => {
    if (u.email.trim().toLowerCase() === email.trim().toLowerCase()) {
      return { ...u, teacherApproval: status };
    }
    return u;
  });
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));

  // If current session is this teacher, update session
  const cur = getCurrentSession();
  if (cur && cur.email.trim().toLowerCase() === email.trim().toLowerCase()) {
    cur.teacherApproval = status;
    saveCurrentSession(cur);
  }
}

// -------------------------------------------------------------
// Backward Compatibility helpers
// -------------------------------------------------------------
export function loginUser(args: any) {
  return loginAccount(args);
}
export function registerUser(args: any) {
  return registerAccount(args);
}
export function signInUser(args: any) {
  return loginAccount(args);
}
export function getActiveAdminLock() {
  return null;
}
export function forceResetAdminLock() {
  localStorage.removeItem(STORAGE_ADMIN_LOCK_LOCAL);
}
