import type {
  DashboardSummary,
  HabitProgress,
  RecentTransaction,
} from "../types/dashboard";

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

const request = async <T>(path: string): Promise<T> => {
  const token = getStoredToken();
  if (!token) {
    throw new Error("You must be signed in to load dashboard data.");
  }

  const response = await fetch(getApiUrl(path), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
};

export const dashboardService = {
  getSummary() {
    return request<DashboardSummary>("/dashboard/summary");
  },

  getRecentTransactions() {
    return request<RecentTransaction[]>("/dashboard/recent-transactions");
  },

  getHabitProgress() {
    return request<HabitProgress[]>("/dashboard/habit-progress");
  },
};
