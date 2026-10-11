import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInAnonymously
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  getDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export {
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously
};
export type { FirebaseUser };

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Validate connection per skill instructions
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.warn("Firestore client is offline, check connection.");
    }
  }
}
testFirestoreConnection();

export interface UserRoleProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'parent' | 'teacher' | 'admin';
  linkedStudentId?: string;
  createdAt: string;
}

// User role management in Firestore
export async function syncUserProfile(user: FirebaseUser, role: 'student' | 'parent' | 'teacher', linkedStudentId?: string): Promise<UserRoleProfile> {
  const profileRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(profileRef);
    if (snap.exists()) {
      return snap.data() as UserRoleProfile;
    }
    const newProfile: UserRoleProfile = {
      uid: user.uid,
      email: user.email || `${role}@atomis.edu`,
      displayName: user.displayName || (role === 'student' ? 'Student User' : role === 'parent' ? 'Guardian User' : 'Faculty Member'),
      role,
      linkedStudentId,
      createdAt: new Date().toISOString()
    };
    await setDoc(profileRef, newProfile);
    return newProfile;
  } catch (err) {
    console.warn("Could not sync user profile to Firestore, using fallback", err);
    return {
      uid: user.uid,
      email: user.email || `${role}@atomis.edu`,
      displayName: role === 'student' ? 'Student' : role === 'parent' ? 'Parent' : 'Teacher',
      role,
      linkedStudentId,
      createdAt: new Date().toISOString()
    };
  }
}
