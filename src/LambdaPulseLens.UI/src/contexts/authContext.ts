import { createContext } from "react";
import type { User } from "../api/authApi";

export type AuthProviderState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthProviderContext = createContext<AuthProviderState | undefined>(undefined);
