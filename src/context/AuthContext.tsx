// src/contexts/AuthContext.tsx
// Only exports: context object + Provider component → safe for Fast Refresh

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

import type {
  AuthContextType,
  AuthState,
  LoginCredentials,
  RegisterData,
  User,
} from "../types/auth";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    storageType: null,
  });

  // Auto-clear error after 6 seconds
  useEffect(() => {
    if (authState.error) {
      const timer = setTimeout(() => {
        setAuthState((prev) => ({ ...prev, error: null }));
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [authState.error]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token =
          localStorage.getItem("auth_token") ||
          sessionStorage.getItem("auth_token");
        const userStr =
          localStorage.getItem("auth_user") ||
          sessionStorage.getItem("auth_user");
        const storageType = localStorage.getItem("auth_token")
          ? "local"
          : sessionStorage.getItem("auth_token")
            ? "session"
            : null;

        if (token && userStr && storageType) {
          const user = JSON.parse(userStr);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            storageType,
          });
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (err) {
        console.error("Auth init failed:", err);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        sessionStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_user");
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          storageType: null,
        });
      }
    };

    initializeAuth();
  }, []);

  const mockApiCall = useCallback(
    async <T,>(data: T, success = true, delay = 1000): Promise<T> =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (success) {
            resolve(data);
          } else {
            reject(new Error("Mock API error"));
          }
        }, delay);
      }),
    [],
  );

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const user = MOCK_USERS.find((u) => u.email === credentials.email);
        if (!user) throw new Error("Invalid email or password");

        const token = `mock-jwt-${user.id}-${Date.now()}`;
        const storage = credentials.rememberMe ? localStorage : sessionStorage;
        const storageType: "local" | "session" = credentials.rememberMe
          ? "local"
          : "session";

        storage.setItem("auth_token", token);
        storage.setItem("auth_user", JSON.stringify(user));

        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          storageType,
        });

        await mockApiCall({ success: true });
        navigate("/dashboard");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        setAuthState((prev) => ({ ...prev, isLoading: false, error: message }));
        throw err;
      }
    },
    [navigate, mockApiCall],
  );

  const register = useCallback(
    async (data: RegisterData) => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      if (data.password !== data.confirmPassword) {
        const msg = "Passwords do not match";
        setAuthState((prev) => ({ ...prev, isLoading: false, error: msg }));
        throw new Error(msg);
      }

      try {
        if (MOCK_USERS.some((u) => u.email === data.email)) {
          throw new Error("Email already in use");
        }

        const newUser: User = {
          id: `u-${Date.now()}`,
          email: data.email,
          name: data.name,
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70 + 1)}`,
        };

        const token = `mock-jwt-${newUser.id}-${Date.now()}`;

        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(newUser));

        setAuthState({
          user: newUser,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          storageType: "local",
        });

        await mockApiCall({ success: true });
        navigate("/dashboard");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Registration failed";
        setAuthState((prev) => ({ ...prev, isLoading: false, error: message }));
        throw err;
      }
    },
    [navigate, mockApiCall],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_user");

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      storageType: null,
    });

    navigate("/auth/login");
  }, [navigate]);

  const updateUser = useCallback((userData: Partial<User>) => {
    setAuthState((prev) => {
      if (!prev.user) return prev;
      const updated = { ...prev.user, ...userData };

      if (prev.storageType === "local") {
        localStorage.setItem("auth_user", JSON.stringify(updated));
      } else if (prev.storageType === "session") {
        sessionStorage.setItem("auth_user", JSON.stringify(updated));
      }

      return { ...prev, user: updated };
    });
  }, []);

  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");
      if (!token) return false;
      await mockApiCall({ success: true }, true, 800);
      return true;
    } catch {
      return false;
    }
  }, [mockApiCall]);

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateUser,
    clearError,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
