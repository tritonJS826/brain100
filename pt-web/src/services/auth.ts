const API_BASE: string = import.meta.env.VITE_API_BASE_URL ?? "";

export type Token = { access_token: string; refresh_token: string; token_type: string };
export type UserOut = { id: number; email: string; name?: string };
export type UserWithTokens = { user: UserOut; tokens: Token };

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";
const TYPE_KEY = "tokenType";
const USER_ID_KEY = "userId";
const USER_EMAIL_KEY = "userEmail";
const USER_NAME_KEY = "userName";
const PROFILE_NAME_KEY = "profileName";

function buildUrl(path: string): string {
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

function saveTokens(tokens: Token): void {
  localStorage.setItem(ACCESS_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
  localStorage.setItem(TYPE_KEY, tokens.token_type || "bearer");
}

function saveUserBasics(user: { id: number; email: string; name?: string }): void {
  localStorage.setItem(USER_ID_KEY, String(user.id));
  localStorage.setItem(USER_EMAIL_KEY, user.email);
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

async function fetchMe(): Promise<UserOut> {
  const res = await fetch(buildUrl("/br-general/users/me"), {credentials: "include"});
  if (!res.ok) {
    const data = await readJson<{ detail?: string }>(res);
    throw new Error(data.detail ?? "Unable to fetch user");
  }

  return res.json() as Promise<UserOut>;
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

  try {
    const me = await fetchMe();
    saveUserBasics(me);
  } catch {
    localStorage.setItem(USER_EMAIL_KEY, email);
  }

  return tokens;
}

export async function registerByEmail(
  email: string,
  password: string,
  fullName: string,
): Promise<UserWithTokens> {
  const res = await fetch(buildUrl("/br-general/users/register"), {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email, password, name: fullName}),
  });

  if (!res.ok) {
    const data = await readJson<{ detail?: string }>(res);
    throw new Error(data.detail || "Registration failed");
  }

  const user = (await res.json()) as UserOut;

  const tokens = await loginByEmail(email, password);

  saveUserBasics({id: user.id, email: user.email, name: fullName || user.name});

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
