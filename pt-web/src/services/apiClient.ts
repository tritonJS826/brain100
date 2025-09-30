const DEFAULT_TIMEOUT = 10000;

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
    const token = localStorage.getItem("accessToken");

    return token ? {Authorization: `Bearer ${token}`} : {};
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
          const errorData = await response.json();
          message = errorData.detail || errorData.message || message;
        } catch {
          // Ignore
        }
        throw new Error(message);
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

}

export const apiClient = new ApiClient(
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
);
