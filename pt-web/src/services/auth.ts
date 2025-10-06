import {localStorageWorker, type Token as LSToken} from "src/globalServices/localStorageWorker";

export type Role = "PATIENT" | "DOCTOR";
export type Token = { access_token: string; refresh_token: string; token_type: string };
export type User = { id: string; email: string; name: string; role: Role };
export type UserWithTokens = { user: User; tokens: Token };
export type ApiError = { detail?: string; message?: string };

const API_BASE = "/br-general";
const USER_STORAGE_KEY = "currentUser";

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isUserWithTokens(value: unknown): value is UserWithTokens {
  return isObjectRecord(value) && "user" in value && "tokens" in value;
}

function isApiError(value: unknown): value is ApiError {
  return isObjectRecord(value) && ("detail" in value || "message" in value);
}

export function getAccessToken(): string {
  const stored = localStorageWorker.getItemByKey<LSToken>("accessToken");

  return stored?.token ?? "";
}
export function getRefreshToken(): string {
  const stored = localStorageWorker.getItemByKey<LSToken>("refreshToken");

  return stored?.token ?? "";
}
export function saveTokens(tokens?: Partial<Token>): void {
  if (!tokens) {
    return;
  }
  if (tokens.access_token) {
    localStorageWorker.setItemByKey("accessToken", {token: tokens.access_token});
  }
  if (tokens.refresh_token) {
    localStorageWorker.setItemByKey("refreshToken", {token: tokens.refresh_token});
  }
}
export function clearTokens(): void {
  localStorageWorker.removeItemByKey("accessToken");
  localStorageWorker.removeItemByKey("refreshToken");
}

function setUserPersist(user: User | null): void {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}
export function getUserPersist(): User | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);

    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);

    return null;
  }
}

async function safeJson<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
function buildError(res: Response, payload: ApiError | null, fallback: string): Error {
  const message = payload?.detail ?? payload?.message ?? `${fallback} (HTTP ${res.status})`;

  return new Error(message);
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(init.headers);
  const access = getAccessToken();
  const refresh = getRefreshToken();
  if (access) {
    headers.set("Authorization", `Bearer ${access}`);
  }
  if (refresh) {
    headers.set("x-refresh-token", refresh);
  }

  return fetch(url, {...init, headers});
}

export async function fetchCurrentUser(): Promise<User> {
  const res = await apiFetch("/auth/me");
  const data = await safeJson<UserWithTokens | ApiError>(res);
  if (!res.ok || !isUserWithTokens(data)) {
    throw buildError(res, isApiError(data) ? data : null, "Failed to fetch user");
  }
  const {user, tokens} = data;
  if (tokens?.access_token) {
    saveTokens({access_token: tokens.access_token, refresh_token: tokens.refresh_token});
  }
  setUserPersist(user);

  return user;
}

export async function loginByEmail(email: string, password: string): Promise<User> {
  const body = new URLSearchParams({username: email, password});
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body,
  });
  const data = await safeJson<UserWithTokens | ApiError>(res);
  if (!res.ok || !isUserWithTokens(data)) {
    throw buildError(res, isApiError(data) ? data : null, "Login failed");
  }
  const {user, tokens} = data;
  saveTokens({access_token: tokens.access_token, refresh_token: tokens.refresh_token});
  setUserPersist(user);

  return user;
}

export async function registerByEmail(email: string, password: string, fullName: string): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email, password, name: fullName, role: "PATIENT"}),
  });
  const data = await safeJson<UserWithTokens | ApiError>(res);
  if (!res.ok || !isUserWithTokens(data)) {
    throw buildError(res, isApiError(data) ? data : null, "Registration failed");
  }
  const {user, tokens} = data;
  saveTokens({access_token: tokens.access_token, refresh_token: tokens.refresh_token});
  setUserPersist(user);

  return user;
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch(`${API_BASE}/auth/logout`, {method: "POST"});
  } finally {
    clearTokens();
    setUserPersist(null);
  }
}
