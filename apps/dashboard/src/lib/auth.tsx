import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

interface User {
  id: string;
  email: string;
  role: "business" | "influencer" | "admin";
  balance: number;
  pendingBalance?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (
    email: string,
    password: string,
    role: "business" | "influencer"
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateBalance: (amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.data();

        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          role: userData?.role || "business",
          balance: userData?.balance || 0,
          pendingBalance: userData?.pendingBalance,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const { user: firebaseUser } = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
    const userData = userDoc.data();

    const user = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      role: userData?.role || "business",
      balance: userData?.balance || 0,
      pendingBalance: userData?.pendingBalance,
    };

    setUser(user);
    return user;
  };

  const signup = async (
    email: string,
    password: string,
    role: "business" | "influencer"
  ) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Create user document in Firestore
    await setDoc(doc(db, "users", firebaseUser.uid), {
      email,
      role,
      balance: 0,
      pendingBalance: 0,
      createdAt: new Date(),
    });

    const user = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      role,
      balance: 0,
      pendingBalance: 0,
    };

    setUser(user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateBalance = async (amount: number) => {
    if (!user) return;

    const userRef = doc(db, "users", user.id);
    await setDoc(
      userRef,
      {
        balance: user.balance + amount,
      },
      { merge: true }
    );

    setUser({
      ...user,
      balance: user.balance + amount,
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, updateBalance }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
