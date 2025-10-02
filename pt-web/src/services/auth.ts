const API_BASE: string = import.meta.env.VITE_API_BASE_URL ?? "";

export type Token = { access_token: string; refresh_token: string; token_type: string };
export type UserOut = { id: number; email: string; name?: string };
export type UserWithTokens = { user: UserOut; tokens: Token };

export const HTTP_BAD_REQUEST = 400;
export const HTTP_UNAUTHORIZED = 401;
export const HTTP_NOT_FOUND = 404;

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";
const TYPE_KEY = "tokenType";
const USER_ID_KEY = "userId";
const USER_EMAIL_KEY = "userEmail";
const USER_NAME_KEY = "userName";
const PROFILE_NAME_KEY = "profileName";

const DEFAULT_TOKEN_TYPE = "Bearer";
const AUTH_HEADER_NAME = "Authorization";

export const DIGITS_ONLY_RE = /^\d+$/;

export function buildUrl(path: string): string {
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

function normalizeTokenType(t?: string): "Bearer" {
  if (!t) {
    return DEFAULT_TOKEN_TYPE;
  }

  return /^bearer$/i.test(t) ? DEFAULT_TOKEN_TYPE : (t as "Bearer");
}

function saveTokens(tokens: Token): void {
  const type = normalizeTokenType(tokens.token_type);
  localStorage.setItem(ACCESS_KEY, tokens.access_token ?? "");
  localStorage.setItem(REFRESH_KEY, tokens.refresh_token ?? "");
  localStorage.setItem(TYPE_KEY, type);
}

function saveUserBasics(user: { id: number; email: string; name?: string }): void {
  localStorage.setItem(USER_ID_KEY, String(user.id));
  localStorage.setItem(USER_EMAIL_KEY, user.email ?? "");
  if (user.name) {
    localStorage.setItem(USER_NAME_KEY, user.name);
    localStorage.setItem(PROFILE_NAME_KEY, user.name);
  }
}

async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    return {} as T;
  }
}

function authHeaders(): HeadersInit | undefined {
  const access = localStorage.getItem(ACCESS_KEY);
  if (!access || access === "undefined") {
    return undefined;
  }
  const type = normalizeTokenType(localStorage.getItem(TYPE_KEY) || DEFAULT_TOKEN_TYPE);

  return {[AUTH_HEADER_NAME]: `${type} ${access}`};
}

export async function fetchUserByStoredId(): Promise<UserOut | null> {
  const idRaw = localStorage.getItem(USER_ID_KEY);
  const idNum = idRaw ? Number(idRaw) : NaN;
  const auth = authHeaders();

  if (!auth || !idRaw || Number.isNaN(idNum)) {
    return null;
  }

  try {
    const res = await fetch(buildUrl(`/br-general/users/${idNum}`), {
      method: "GET",
      headers: {"Content-Type": "application/json", ...auth},
      credentials: "include",
    });

    if (!res.ok) {
      return null;
    }

    const user = (await res.json()) as UserOut;
    saveUserBasics(user);

    return user;
  } catch {
    return null;
  }
}

export async function loginByEmail(email: string, password: string): Promise<Token> {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  const res = await fetch(buildUrl("/br-general/auth/login"), {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body,
    credentials: "include",
  });

  if (!res.ok) {
    const data = await readJson<{ detail?: string }>(res);
    throw new Error(data.detail ?? "Login failed");
  }

  const tokens = (await res.json()) as Token;
  saveTokens(tokens);

  const me = await fetchUserByStoredId();
  if (!me) {
    localStorage.setItem(USER_EMAIL_KEY, email);
  }

  return tokens;
}

export async function registerByEmail(
  email: string,
  password: string,
  fullName: string,
): Promise<UserWithTokens> {
  const endpoints = ["/br-general/auth/register", "/br-general/users/register"];

  let user: UserOut | null = null;
  let lastError: Error | null = null;

  for (const ep of endpoints) {
    try {
      const res = await fetch(buildUrl(ep), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password, name: fullName}),
        credentials: "include",
      });

      if (res.status === HTTP_NOT_FOUND) {
        continue;
      }

      if (!res.ok) {
        const data = await readJson<{ detail?: string }>(res);
        throw new Error(data.detail || `Registration failed (${res.status})`);
      }

      user = (await res.json()) as UserOut;
      break;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error("Registration failed");
    }
  }

  if (!user) {
    throw lastError ?? new Error("Registration endpoint not found");
  }

  const tokens = await loginByEmail(email, password);

  saveUserBasics({id: user.id, email: user.email, name: fullName || user.name});
  await fetchUserByStoredId();

  return {user: {id: user.id, email: user.email, name: fullName || user.name}, tokens};
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch(buildUrl("/br-general/auth/logout"), {method: "POST", credentials: "include"});
  } catch {
    // Ignore
  } finally {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(TYPE_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_NAME_KEY);
  }
}
