import type {
  ForgotPasswordResult,
  LoginCredentials,
  RegisterData,
  ResetPasswordPayload,
  User,
} from "../types/auth";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";
const AUTH_TOKEN_EXPIRES_AT_KEY = "auth_token_expires_at";
const AUTH_REFRESH_TOKEN_KEY = "auth_refresh_token";

const AUTH_MODE = import.meta.env.VITE_AUTH_MODE ?? "mock";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

const ACCESS_TOKEN_TTL_MINUTES_FALLBACK = 15;

const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "demo@example.com",
    name: "Demo User",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    email: "demo2@example.com",
    name: "Demo User 2",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
];

export interface AuthSession {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt: number;
  storageType: "local" | "session";
}

interface ApiEnvelope<T> {
  message: string;
  data: T;
}

interface ApiErrorShape {
  message?: string;
}

interface ApiUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  createdAt?: string;
}

interface LoginApiData {
  user: ApiUser;
  accessToken: string;
  refreshToken: string;
  expiresIn?: string;
}

interface RefreshApiData {
  accessToken: string;
  refreshToken: string;
  expiresIn?: string;
}

interface ForgotPasswordApiData {
  email: string;
  resetToken: string | null;
  accepted: boolean;
  delivery: string;
}

const getStorageByType = (storageType: "local" | "session") =>
  storageType === "local" ? localStorage : sessionStorage;

const getStoredSession = (): AuthSession | null => {
  const storageType = localStorage.getItem(AUTH_TOKEN_KEY)
    ? "local"
    : sessionStorage.getItem(AUTH_TOKEN_KEY)
      ? "session"
      : null;

  if (!storageType) return null;

  const storage = getStorageByType(storageType);
  const token = storage.getItem(AUTH_TOKEN_KEY);
  const userStr = storage.getItem(AUTH_USER_KEY);
  const expiresAtStr = storage.getItem(AUTH_TOKEN_EXPIRES_AT_KEY);

  if (!token || !userStr || !expiresAtStr) return null;

  const user = JSON.parse(userStr) as User;
  const expiresAt = Number(expiresAtStr);

  if (!Number.isFinite(expiresAt)) return null;

  return { user, token, expiresAt, storageType };
};

const clearStorage = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_EXPIRES_AT_KEY);
  localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_EXPIRES_AT_KEY);
  sessionStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
};

const persistSession = (session: AuthSession) => {
  clearStorage();
  const storage = getStorageByType(session.storageType);
  storage.setItem(AUTH_TOKEN_KEY, session.token);
  storage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
  storage.setItem(AUTH_TOKEN_EXPIRES_AT_KEY, String(session.expiresAt));
  if (session.refreshToken) {
    storage.setItem(AUTH_REFRESH_TOKEN_KEY, session.refreshToken);
  }
};

const getStoredRefreshToken = (storageType: "local" | "session") => {
  return getStorageByType(storageType).getItem(AUTH_REFRESH_TOKEN_KEY);
};

const getApiUrl = (path: string) => {
  const normalizedBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

const parseExpiresInToMs = (expiresIn?: string) => {
  if (!expiresIn) {
    return ACCESS_TOKEN_TTL_MINUTES_FALLBACK * 60 * 1000;
  }

  const match = expiresIn.trim().match(/^(\d+)([smhd])$/i);
  if (!match) {
    return ACCESS_TOKEN_TTL_MINUTES_FALLBACK * 60 * 1000;
  }

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  const unitMsMap: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * (unitMsMap[unit] ?? 60 * 1000);
};

const toUser = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  email: apiUser.email,
  name: apiUser.name,
  avatar: apiUser.avatarUrl ?? undefined,
});

const parseApiError = async (response: Response) => {
  try {
    const payload = (await response.json()) as ApiErrorShape;
    return payload.message ?? "Request failed";
  } catch {
    return "Request failed";
  }
};

const apiRequest = async <T>(
  path: string,
  init: RequestInit,
  token?: string,
): Promise<ApiEnvelope<T>> => {
  const response = await fetch(getApiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return (await response.json()) as ApiEnvelope<T>;
};

const isApiMode = () => AUTH_MODE === "api";

const simulateLatency = async (delay = 700) => {
  await new Promise((resolve) => setTimeout(resolve, delay));
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    if (isApiMode()) {
      const payload = await apiRequest<LoginApiData>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const expiresAt = Date.now() + parseExpiresInToMs(payload.data.expiresIn);
      const session: AuthSession = {
        user: toUser(payload.data.user),
        token: payload.data.accessToken,
        refreshToken: payload.data.refreshToken,
        expiresAt,
        storageType: credentials.rememberMe ? "local" : "session",
      };

      persistSession(session);
      return session;
    }

    await simulateLatency();

    const user = MOCK_USERS.find((u) => u.email === credentials.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const storageType: "local" | "session" = credentials.rememberMe
      ? "local"
      : "session";

    const now = Date.now();
    const expiresInMs = credentials.rememberMe
      ? 1000 * 60 * 60 * 24 * 30
      : 1000 * 60 * 60 * 12;

    const session: AuthSession = {
      user,
      token: `mock-jwt-${user.id}-${now}`,
      expiresAt: now + expiresInMs,
      storageType,
    };

    persistSession(session);
    return session;
  },

  async register(data: RegisterData): Promise<AuthSession> {
    if (isApiMode()) {
      const payload = await apiRequest<LoginApiData>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const expiresAt = Date.now() + parseExpiresInToMs(payload.data.expiresIn);
      const session: AuthSession = {
        user: toUser(payload.data.user),
        token: payload.data.accessToken,
        refreshToken: payload.data.refreshToken,
        expiresAt,
        storageType: data.rememberMe ? "local" : "session",
      };

      persistSession(session);
      return session;
    }

    await simulateLatency();

    if (MOCK_USERS.some((u) => u.email === data.email)) {
      throw new Error("Email already in use");
    }

    const now = Date.now();
    const session: AuthSession = {
      user: {
        id: `u-${now}`,
        email: data.email,
        name: data.name,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70 + 1)}`,
      },
      token: `mock-jwt-u-${now}-${now}`,
      expiresAt: now + 1000 * 60 * 60 * 24 * 30,
      storageType: "local",
    };

    persistSession(session);
    return session;
  },

  async refreshToken(): Promise<AuthSession | null> {
    if (isApiMode()) {
      const current = getStoredSession();
      if (!current) return null;

      const refreshToken =
        current.refreshToken ?? getStoredRefreshToken(current.storageType);
      if (!refreshToken) {
        clearStorage();
        return null;
      }

      try {
        const refreshed = await apiRequest<RefreshApiData>("/auth/refresh", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });

        const nextSession: AuthSession = {
          ...current,
          token: refreshed.data.accessToken,
          refreshToken: refreshed.data.refreshToken,
          expiresAt: Date.now() + parseExpiresInToMs(refreshed.data.expiresIn),
        };

        persistSession(nextSession);
        return nextSession;
      } catch {
        clearStorage();
        return null;
      }
    }

    await simulateLatency(350);

    const current = getStoredSession();
    if (!current) return null;

    if (Date.now() >= current.expiresAt) {
      clearStorage();
      return null;
    }

    const refreshed: AuthSession = {
      ...current,
      token: `mock-jwt-${current.user.id}-${Date.now()}`,
      expiresAt: Date.now() + 1000 * 60 * 60 * 12,
    };

    persistSession(refreshed);
    return refreshed;
  },

  async restoreSession(): Promise<AuthSession | null> {
    const session = getStoredSession();
    if (!session) return null;

    if (Date.now() >= session.expiresAt) {
      return this.refreshToken();
    }

    if (!isApiMode()) {
      return session;
    }

    try {
      const me = await apiRequest<ApiUser>(
        "/auth/me",
        { method: "GET" },
        session.token,
      );
      const updated: AuthSession = {
        ...session,
        user: toUser(me.data),
      };
      persistSession(updated);
      return updated;
    } catch {
      return this.refreshToken();
    }
  },

  updateStoredUser(userData: Partial<User>) {
    const current = getStoredSession();
    if (!current) return;

    const updated: AuthSession = {
      ...current,
      user: { ...current.user, ...userData },
    };

    persistSession(updated);
  },

  logout() {
    if (isApiMode()) {
      const session = getStoredSession();
      const refreshToken =
        session?.refreshToken ??
        (session ? getStoredRefreshToken(session.storageType) : null);

      if (refreshToken) {
        void apiRequest<null>("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        }).catch(() => undefined);
      }
    }

    clearStorage();
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResult> {
    if (isApiMode()) {
      const payload = await apiRequest<ForgotPasswordApiData>(
        "/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({ email }),
        },
      );

      return payload.data;
    }

    await simulateLatency(900);
    const user = MOCK_USERS.find((item) => item.email === email);

    return {
      email,
      delivery: "mock",
      accepted: true,
      resetToken: user ? `mock-reset-${user.id}` : null,
    };
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    if (isApiMode()) {
      await apiRequest<null>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return;
    }

    await simulateLatency(900);
  },

  isTokenExpired(expiresAt: number | null): boolean {
    if (!expiresAt) return true;
    return Date.now() >= expiresAt;
  },
};
