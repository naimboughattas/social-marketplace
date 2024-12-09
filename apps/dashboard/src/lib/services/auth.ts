import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export interface User {
  id: string;
  email: string;
  role: "business" | "influencer" | "admin";
  balance: number;
  pendingBalance?: number;
  name?: string;
  company?: string;
}

export async function signUp(
  email: string,
  password: string,
  role: "business" | "influencer"
): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const userData = {
    email,
    role,
    balance: 0,
    pendingBalance: 0,
    createdAt: new Date(),
  };

  await setDoc(doc(db, "users", userCredential.user.uid), userData);

  return {
    id: userCredential.user.uid,
    ...userData,
  };
}

export async function signIn(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

  if (!userDoc.exists()) {
    throw new Error("User data not found");
  }

  return {
    id: userCredential.user.uid,
    ...userDoc.data(),
  } as User;
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function updateUserProfile(
  userId: string,
  data: Partial<User>
): Promise<void> {
  await updateDoc(doc(db, "users", userId), data);
}

export async function getCurrentUser(): Promise<User | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  const userDoc = await getDoc(doc(db, "users", currentUser.uid));
  if (!userDoc.exists()) return null;

  return {
    id: currentUser.uid,
    ...userDoc.data(),
  } as User;
}
