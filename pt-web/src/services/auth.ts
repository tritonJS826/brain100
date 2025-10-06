import {localStorageWorker, type Token as LSToken} from "src/globalServices/localStorageWorker";

export type Role = "PATIENT" | "DOCTOR";
export type Token = { access_token: string; refresh_token: string; token_type: string };
export type User = { id: string; email: string; name: string; role: Role };
export type UserWithTokens = { user: User; tokens: Token };
export type ApiError = { detail?: string; message?: string };

const API_BASE = "/br-general";
const USER_STORAGE_KEY = "currentUser";

/* ---------- type guards ---------- */

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isUser(x: unknown): x is User {
  if (!isObjectRecord(x)) {
    return false;
  }

  return (
    typeof x.id === "string" &&
    typeof x.email === "string" &&
    typeof x.name === "string" &&
    (x.role === "PATIENT" || x.role === "DOCTOR")
  );
}

function hasUserEnvelope(x: unknown): x is { user: User } {
  if (!isObjectRecord(x)) {
    return false;
  }
  const u = (x as Record<string, unknown>).user;

  return isUser(u);
}

function isUserWithTokens(x: unknown): x is UserWithTokens {
  if (!isObjectRecord(x)) {
    return false;
  }
  const uOk = isUser((x as Record<string, unknown>).user);
  const t = (x as Record<string, unknown>).tokens;
  const tOk =
    isObjectRecord(t) &&
    typeof t.access_token === "string" &&
    typeof t.refresh_token === "string" &&
    typeof t.token_type === "string";

  return uOk && tOk;
}

function isApiError(x: unknown): x is ApiError {
  return (
    isObjectRecord(x) &&
    (typeof (x as Record<string, unknown>).detail === "string" ||
      typeof (x as Record<string, unknown>).message === "string")
  );
}

/* ---------- tokens ---------- */

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

/* ---------- user persist ---------- */

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

/* ---------- helpers ---------- */

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

/* ---------- API ---------- */

export async function fetchCurrentUser(): Promise<User> {
  const res = await apiFetch("/users/me");
  const data = await safeJson<unknown>(res);

  if (!res.ok) {
    throw buildError(res, isApiError(data) ? data : null, "Failed to fetch user");
  }

  const xAccess = res.headers.get("x-new-access-token");
  const xRefresh = res.headers.get("x-new-refresh-token");
  if (xAccess || xRefresh) {
    saveTokens({
      access_token: xAccess ?? undefined,
      refresh_token: xRefresh ?? undefined,
    });
  }

  let user: User | null = null;
  if (isUserWithTokens(data)) {
    user = data.user;
  } else if (hasUserEnvelope(data)) {
    user = data.user;
  }

  if (!user) {
    throw new Error("Malformed /users/me response");
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
  const data = await safeJson<unknown>(res);
  if (!res.ok || !isUserWithTokens(data)) {
    throw buildError(res, isApiError(data) ? data : null, "Login failed");
  }
  saveTokens({access_token: data.tokens.access_token, refresh_token: data.tokens.refresh_token});
  setUserPersist(data.user);

  return data.user;
}

export async function registerByEmail(email: string, password: string, fullName: string): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email, password, name: fullName, role: "PATIENT"}),
  });
  const data = await safeJson<unknown>(res);
  if (!res.ok || !isUserWithTokens(data)) {
    throw buildError(res, isApiError(data) ? data : null, "Registration failed");
  }
  saveTokens({access_token: data.tokens.access_token, refresh_token: data.tokens.refresh_token});
  setUserPersist(data.user);

  return data.user;
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch(`${API_BASE}/auth/logout`, {method: "POST"});
  } finally {
    clearTokens();
    setUserPersist(null);
  }
}
