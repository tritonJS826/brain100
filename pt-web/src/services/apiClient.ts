import {localStorageWorker, Token as LSToken} from "src/globalServices/localStorageWorker";
import {env} from "src/utils/env/env";

const DEFAULT_TIMEOUT = 10000;

class ApiClient {

  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public get<T>(url: string, init?: RequestInit) {
    return this.request<T>("GET", url, undefined, init);
  }

  public post<T>(url: string, body?: unknown, init?: RequestInit) {
    return this.request<T>("POST", url, body, init);
  }

  public put<T>(url: string, body?: unknown, init?: RequestInit) {
    return this.request<T>("PUT", url, body, init);
  }

  public patch<T>(url: string, body?: unknown, init?: RequestInit) {
    return this.request<T>("PATCH", url, body, init);
  }

  public delete<T>(url: string, init?: RequestInit) {
    return this.request<T>("DELETE", url, undefined, init);
  }

  private authHeaders(): Record<string, string> {
    const accessObj = localStorageWorker.getItemByKey<LSToken>("accessToken");
    const refreshObj = localStorageWorker.getItemByKey<LSToken>("refreshToken");

    const headers: Record<string, string> = {"Content-Type": "application/json"};
    if (accessObj?.token) {
      headers.Authorization = `Bearer ${accessObj.token}`;
    }
    if (refreshObj?.token) {
      headers["x-refresh-token"] = refreshObj.token;
    }

    return headers;
  }

  private async request<T>(method: string, url: string, body?: unknown, init?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    const res = await fetch(`${this.baseUrl}${url}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {...this.authHeaders(), ...(init?.headers ?? {})},
      signal: controller.signal,
      ...init,
    });

    clearTimeout(timeoutId);

    return (await res.json()) as T;
  }

}

export const apiClient = new ApiClient(env.API_BASE_PATH);
