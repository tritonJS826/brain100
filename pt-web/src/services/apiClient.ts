import {localStorageWorker, type Token as LSToken} from "src/globalServices/localStorageWorker";

const DEFAULT_TIMEOUT = 10000;
const NO_CONTENT_STATUS = 204;
const API_BASE = "/br-general";

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  const isNotNull = Boolean(value);
  const isObjectType = typeof value === "object";
  const isNotArray = !Array.isArray(value);

  return isNotNull && isObjectType && isNotArray;
}

export class ApiClient {

  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public get<T>(url: string, options?: RequestInit) {
    return this.request<T>("GET", url, undefined, options);
  }

  public post<T>(url: string, body?: unknown, options?: RequestInit) {
    return this.request<T>("POST", url, body, options);
  }

  public put<T>(url: string, body?: unknown, options?: RequestInit) {
    return this.request<T>("PUT", url, body, options);
  }

  public patch<T>(url: string, body?: unknown, options?: RequestInit) {
    return this.request<T>("PATCH", url, body, options);
  }

  public delete<T>(url: string, options?: RequestInit) {
    return this.request<T>("DELETE", url, undefined, options);
  }

  private getAuthHeaders(): Record<string, string> {
    const accessObj = localStorageWorker.getItemByKey<LSToken>("accessToken");
    const refreshObj = localStorageWorker.getItemByKey<LSToken>("refreshToken");

    const headers: Record<string, string> = {};
    if (accessObj?.token) {
      headers.Authorization = `Bearer ${accessObj.token}`;
    }
    if (refreshObj?.token) {
      headers["x-refresh-token"] = refreshObj.token;
    }

    return headers;
  }

  private async request<T>(
    method: string,
    url: string,
    body?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
          ...(options?.headers ?? {}),
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let message = response.statusText;
        try {
          const err = await response.json();
          if (isObjectRecord(err)) {
            const d = typeof err.detail === "string" ? err.detail : undefined;
            const m = typeof err.message === "string" ? err.message : undefined;
            message = d ?? m ?? message;
          }
        } catch {
          // Ignore
        }
        throw new Error(message);
      }

      let payload: unknown = null;
      if (response.status !== NO_CONTENT_STATUS) {
        try {
          payload = await response.json();
        } catch {
          payload = null;
        }
      }

      return payload as T;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

}

export const apiClient = new ApiClient(API_BASE);
