//in-memory store
let csrfToken: string | null = null;

//response type from the server
type CsrfResponse = {
  success: boolean;
  token?: unknown;
};

//fresh token forces fetch for a new csrf token from the server
export async function getCsrfToken(forceRefresh = false): Promise<string> {
  if (csrfToken && !forceRefresh) {
    return csrfToken;
  }

  //include cookies
  const response = await fetch("/api/auth/csrf", { method: "GET", credentials: "include" });

  if (!response.ok) {
    throw new Error("Failed to get CSRF token.");
  }

  const data = (await response.json()) as CsrfResponse;

  if (!data.success || typeof data.token !== "string") {
    throw new Error("Invalid CSRF response.");
  }

  //save to memory
  csrfToken = data.token;
  //return to caller
  return csrfToken;
}

//logout scenarios
export function clearCsrfToken() {
  csrfToken = null;
}
