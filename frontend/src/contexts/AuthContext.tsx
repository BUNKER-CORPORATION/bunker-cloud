import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthError {
  message: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    // TODO: Implement your own backend authentication
    try {
      // Placeholder: Create a mock user for now
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name,
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return { error: null };
    } catch (err) {
      return { error: { message: 'Sign up failed' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    // TODO: Implement your own backend authentication
    try {
      // Placeholder: Create a mock user for now
      const mockUser: User = {
        id: crypto.randomUUID(),
        email,
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { error: null };
    } catch (err) {
      return { error: { message: 'Sign in failed' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const signInWithGoogle = async () => {
    // TODO: Implement your own OAuth flow
    console.log('Google sign-in not yet implemented');
  };

  const signInWithGithub = async () => {
    // TODO: Implement your own OAuth flow
    console.log('GitHub sign-in not yet implemented');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        signInWithGoogle,
        signInWithGithub,
      }}
    >
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
