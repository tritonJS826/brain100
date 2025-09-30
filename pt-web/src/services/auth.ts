import {apiClient} from "src/services/apiClient";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
};

const STORAGE_TOKEN_KEY = "auth.accessToken";

function saveToken(token: string) {
  localStorage.setItem(STORAGE_TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(STORAGE_TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();

  return token ? {Authorization: `Bearer ${token}`} : {};
}

export async function login(payload: LoginPayload): Promise<AuthUser> {
  const response = await apiClient.post<AuthResponse>("/auth/login", payload);
  saveToken(response.accessToken);

  return response.user;
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const response = await apiClient.post<AuthResponse>("/auth/register", payload);
  saveToken(response.accessToken);

  return response.user;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const user = await apiClient.get<AuthUser>("/auth/me", {headers: authHeaders() as Record<string, string>});

  return user;
}

export function logout() {
  clearToken();
}
