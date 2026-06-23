import { createContext, useContext, useEffect, useState } from "react";
import {
  register as registerRequest,
  login as loginRequest,
  getCurrentUser,
  logout as logoutRequest,
  type User
} from "../api/authApi";

type AuthProviderProps = { children: React.ReactNode };

type AuthProviderState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthProviderContext = createContext<AuthProviderState | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeAuth() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    initializeAuth();
  }, []);

  async function register(email: string, password: string) {
    const registeredUser = await registerRequest(email, password);
    setUser(registeredUser);
  }

  async function login(email: string, password: string) {
    const loggedInUser = await loginRequest(email, password);
    setUser(loggedInUser);
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
  }

  const value: AuthProviderState = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    register,
    login,
    logout
  };

  return <AuthProviderContext.Provider value={value}>{children}</AuthProviderContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
