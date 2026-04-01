const AUTH_TOKEN_KEY = "auth_token";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

interface ApiEnvelope<T> {
  data: T;
  message: string;
}

interface ApiErrorShape {
  message?: string;
}

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  requiresAuth?: boolean;
}

const getStoredToken = () => {
  return (
    localStorage.getItem(AUTH_TOKEN_KEY) ??
    sessionStorage.getItem(AUTH_TOKEN_KEY)
  );
};

const getApiUrl = (path: string) => {
  const normalizedBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

const parseApiError = async (response: Response) => {
  try {
    const payload = (await response.json()) as ApiErrorShape;
    return payload.message ?? "Request failed";
  } catch {
    return "Request failed";
  }
};

export const apiClient = {
  async request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const method = options.method ?? "GET";
    const requiresAuth = options.requiresAuth ?? true;
    const token = getStoredToken();

    if (requiresAuth && !token) {
      throw new Error("You must be signed in to complete this action.");
    }

    const response = await fetch(getApiUrl(path), {
      method,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(requiresAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const payload = (await response.json()) as ApiEnvelope<T>;
    return payload.data;
  },
};
