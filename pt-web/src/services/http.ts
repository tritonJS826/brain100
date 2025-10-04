const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export function getAccess() {
  return localStorage.getItem("accessToken") ?? "";
}
export function getRefresh() {
  return localStorage.getItem("refreshToken") ?? "";
}
export function getTokenType() {
  return localStorage.getItem("tokenType") ?? "Bearer";
}

export function saveTokens(tokens?: {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
}) {
  if (!tokens) {
    return;
  }
  if (tokens.access_token) {
    localStorage.setItem("accessToken", tokens.access_token);
  }
  if (tokens.refresh_token) {
    localStorage.setItem("refreshToken", tokens.refresh_token);
  }
  if (tokens.token_type) {
    localStorage.setItem("tokenType", tokens.token_type);
  }
}

export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tokenType");
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers = new Headers(init.headers || {});
  const access = getAccess();
  const refresh = getRefresh();

  if (access) {
    headers.set("Authorization", `${getTokenType()} ${access}`);
  }
  if (refresh) {
    headers.set("x-refresh-token", refresh);
  }

  return fetch(url, {
    ...init,
    headers,
    credentials: "include",
  });
}
