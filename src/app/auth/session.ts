export type AuthRole = "user" | "admin";

export type AuthSession = {
  role: AuthRole;
  email: string;
  accessToken?: string;
};

const AUTH_STORAGE_KEY = "only-escorts-auth-session";

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as AuthSession;

    if ((parsed.role !== "user" && parsed.role !== "admin") || !parsed.email) {
      return null;
    }

    if (
      typeof parsed.accessToken !== "undefined" &&
      typeof parsed.accessToken !== "string"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function setAuthSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function hasRole(role: AuthRole): boolean {
  const session = getAuthSession();
  return session?.role === role;
}
