import type { LoginCredentials, RegisterData, User } from "../types/auth";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";
const AUTH_TOKEN_EXPIRES_AT_KEY = "auth_token_expires_at";

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
  expiresAt: number;
  storageType: "local" | "session";
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
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_EXPIRES_AT_KEY);
};

const persistSession = (session: AuthSession) => {
  clearStorage();
  const storage = getStorageByType(session.storageType);
  storage.setItem(AUTH_TOKEN_KEY, session.token);
  storage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
  storage.setItem(AUTH_TOKEN_EXPIRES_AT_KEY, String(session.expiresAt));
};

const simulateLatency = async (delay = 700) => {
  await new Promise((resolve) => setTimeout(resolve, delay));
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
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

  restoreSession(): AuthSession | null {
    const session = getStoredSession();
    if (!session) return null;

    if (Date.now() >= session.expiresAt) {
      clearStorage();
      return null;
    }

    return session;
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
    clearStorage();
  },

  isTokenExpired(expiresAt: number | null): boolean {
    if (!expiresAt) return true;
    return Date.now() >= expiresAt;
  },
};
