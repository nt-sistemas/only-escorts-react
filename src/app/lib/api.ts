import { getAuthSession } from "../auth/session.js";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (!path.startsWith("/")) {
    return `${API_BASE_URL}/${path}`;
  }

  return `${API_BASE_URL}${path}`;
}

function isProtectedPath(path: string): boolean {
  const isProtected = (pathname: string) =>
    pathname.startsWith("/admin") || pathname.startsWith("/plan");

  if (/^https?:\/\//i.test(path)) {
    try {
      return isProtected(new URL(path).pathname);
    } catch {
      return false;
    }
  }

  return isProtected(path);
}

function buildHeaders(path: string, initHeaders?: HeadersInit): Headers {
  const headers = new Headers(initHeaders);
  const session = getAuthSession();

  if (isProtectedPath(path) && session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  return headers;
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = buildHeaders(path, init?.headers);
  headers.set("Accept", "application/json");

  const response = await fetch(buildUrl(path), {
    ...init,
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function apiPost<TResponse, TBody extends Record<string, unknown>>(
  path: string,
  body: TBody,
  init?: RequestInit,
): Promise<TResponse> {
  const headers = buildHeaders(path, init?.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  const response = await fetch(buildUrl(path), {
    ...init,
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as TResponse;
}

export async function apiPut<TResponse, TBody extends Record<string, unknown>>(
  path: string,
  body: TBody,
  init?: RequestInit,
): Promise<TResponse> {
  const headers = buildHeaders(path, init?.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  const response = await fetch(buildUrl(path), {
    ...init,
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as TResponse;
}

export async function apiDelete(
  path: string,
  init?: RequestInit,
): Promise<void> {
  const headers = buildHeaders(path, init?.headers);
  headers.set("Accept", "application/json");

  const response = await fetch(buildUrl(path), {
    ...init,
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
}
