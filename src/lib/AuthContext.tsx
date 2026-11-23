import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, signInAnonymously, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

interface UserProfile {
  displayName: string;
  highestScore?: number;
  createdAt: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (displayName: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateHighestScore: (score: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          // If no profile exists yet, we wait until signIn sets it
          setProfile({
            displayName: currentUser.displayName || 'Anonymous Scholar',
            createdAt: new Date(),
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (displayName: string) => {
    try {
      const userCredential = await signInAnonymously(auth);
      const currentUser = userCredential.user;
      
      await updateProfile(currentUser, { displayName });
      
      const userRef = doc(db, 'users', currentUser.uid);
      const { serverTimestamp } = await import('firebase/firestore');
      
      const newProfile = {
        displayName,
        createdAt: serverTimestamp(),
      };
      
      await setDoc(userRef, newProfile, { merge: true });
      setProfile(newProfile as any);
      setUser({ ...currentUser, displayName } as User);
    } catch (error) {
      console.error('Error signing in anonymously', error);
      if (error.code === 'auth/admin-restricted-operation' || error.message.includes('admin-restricted-operation')) {
        alert("Anonymous Sign-In is disabled in Firebase. Falling back to offline mode for now. To enable leaderboards, please enable Anonymous Sign-in in your Firebase Console -> Authentication -> Sign-in method.");
        // Fallback for offline play
        const localUid = 'local-' + Date.now();
        setUser({ uid: localUid, isAnonymous: true } as User);
        setProfile({ displayName, createdAt: new Date() });
      }
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const updateHighestScore = async (score: number) => {
    if (!user || !profile) return;
    if (profile.highestScore === undefined || score > profile.highestScore) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { highestScore: score }, { merge: true });
      } catch (e) {
        console.warn("Could not save highest score to DB", e);
      }
      setProfile({ ...profile, highestScore: score });
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, logOut, updateHighestScore }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
