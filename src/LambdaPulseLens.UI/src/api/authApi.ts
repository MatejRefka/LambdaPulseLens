import { getCsrfToken, clearCsrfToken } from "./csrf";

export type User = {
  id: number;
  email: string;
};

type AuthResponse = {
  success: boolean;
  user?: User;
  message?: string;
};

export async function register(email: string, password: string): Promise<User> {
  const csrfToken = await getCsrfToken();

  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
    credentials: "include",
    body: JSON.stringify({ email, password })
  });

  const data = (await response.json().catch(() => null)) as AuthResponse | null;

  if (!response.ok) {
    throw new Error(data?.message ? `Registration failed. ${data.message}` : "Registration failed.");
  }

  if (!data?.success || !data.user) {
    throw new Error(data?.message ? `Registration failed. ${data.message}` : "Registration failed.");
  }

  return data.user;
}

export async function login(email: string, password: string): Promise<User> {
  const csrfToken = await getCsrfToken();

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
    credentials: "include",
    body: JSON.stringify({ email, password })
  });

  const data = (await response.json().catch(() => null)) as AuthResponse | null;

  if (!response.ok) {
    throw new Error(data?.message ? `Login failed. ${data.message}` : "Login failed.");
  }

  if (!data?.success || !data.user) {
    throw new Error(data?.message ? `Login failed. ${data.message}` : "Login failed.");
  }

  return data.user;
}

export async function getCurrentUser(): Promise<User | null> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include"
  });

  //the browser has no authenticationd session (valid)
  if (response.status === 401) {
    return null;
  }

  //internal server error
  if (!response.ok) {
    throw new Error("Failed to load current user.");
  }

  const data = (await response.json()) as AuthResponse;

  if (!data.success || !data.user) {
    return null;
  }

  return data.user;
}

export async function logout(): Promise<void> {
  const csrfToken = await getCsrfToken();

  const response = await fetch("/api/auth/logout", {
    method: "POST",
    headers: { "X-CSRF-Token": csrfToken },
    credentials: "include"
  });

  clearCsrfToken();

  if (!response.ok) {
    throw new Error("Logout failed.");
  }
}
