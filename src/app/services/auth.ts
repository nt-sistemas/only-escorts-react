import { apiPost } from "../lib/api.js";
import type { AuthRole } from "../auth/session.js";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  role?: string;
  email?: string;
  accessToken?: string;
  access_token?: string;
  token?: string;
  user?: {
    email?: string;
    role?: string;
  };
};

type RegisterRequest = {
  name?: string;
  email: string;
  password: string;
  planId?: string;
  role?: "USER" | "ADMIN";
  status?:
    | "ACTIVE"
    | "PROCESSING"
    | "INACTIVE"
    | "CANCELED"
    | "PAST_DUE"
    | "UNPAID";
};

type RegisterResponse = {
  email?: string;
  user?: {
    email?: string;
  };
};

type RegisterApiResponse = RegisterResponse | { data: RegisterResponse };

export type LoginResult = {
  email: string;
  role: AuthRole;
  accessToken?: string;
};

function normalizeRole(value?: string): AuthRole {
  const normalized = value?.toLowerCase();
  return normalized === "admin" ? "admin" : "user";
}

export async function loginWithApi(
  payload: LoginRequest,
): Promise<LoginResult> {
  const response = await apiPost<LoginResponse, LoginRequest>(
    "/auth/login",
    payload,
  );

  const role = normalizeRole(response.role ?? response.user?.role);
  const email = response.email ?? response.user?.email ?? payload.email;
  const accessToken =
    response.accessToken ?? response.access_token ?? response.token;

  return {
    role,
    email,
    ...(accessToken ? { accessToken } : {}),
  };
}

export async function registerWithApi(
  payload: RegisterRequest,
): Promise<{ email: string }> {
  const response = await apiPost<RegisterApiResponse, RegisterRequest>(
    "/create-user",
    payload,
  );
  const source = "data" in response ? response.data : response;

  return {
    email: source.email ?? source.user?.email ?? payload.email,
  };
}
