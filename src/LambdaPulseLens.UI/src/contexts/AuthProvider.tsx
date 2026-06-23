import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  register as registerRequest,
  login as loginRequest,
  getCurrentUser,
  logout as logoutRequest,
  type User
} from "../api/authApi";
import { AuthProviderContext, type AuthProviderState } from "./authContext";

type AuthProviderProps = { children: ReactNode };

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
    void initializeAuth();
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
