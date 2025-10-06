import {localStorageWorker, type Token as LSToken} from "src/globalServices/localStorageWorker";

export const API_BASE: string = "/br-general";

export function getAccessToken(): string {
  const token = localStorageWorker.getItemByKey<LSToken>("accessToken");

  return token?.token ?? "";
}

export function getRefreshToken(): string {
  const token = localStorageWorker.getItemByKey<LSToken>("refreshToken");

  return token?.token ?? "";
}

export function saveTokens(tokens?: { access_token?: string; refresh_token?: string }): void {
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
