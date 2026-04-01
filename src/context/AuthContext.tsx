// src/contexts/AuthContext.tsx
// Only exports: context object + Provider component → safe for Fast Refresh

import {
  createContext,
  useCallback,
  useEffect,
  useRef,
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
import { authService } from "../services/authService";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const hasInitialized = useRef(false);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    tokenExpiresAt: null,
    isAuthenticated: false,
    isLoading: true,
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
        const session = await authService.restoreSession();

        if (session) {
          setAuthState({
            user: session.user,
            token: session.token,
            tokenExpiresAt: session.expiresAt,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            storageType: session.storageType,
          });
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (err) {
        console.error("Auth init failed:", err);
        authService.logout();
        setAuthState({
          user: null,
          token: null,
          tokenExpiresAt: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          storageType: null,
        });
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }

    if (!authState.isAuthenticated || !authState.tokenExpiresAt) {
      return;
    }

    const timeToExpiry = authState.tokenExpiresAt - Date.now();
    if (timeToExpiry <= 0) {
      authService.logout();
      setAuthState({
        user: null,
        token: null,
        tokenExpiresAt: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Session expired. Please sign in again.",
        storageType: null,
      });
      navigate("/auth/login", { replace: true });
      return;
    }

    const maxTimeout = 2_147_483_647;
    const timeout = window.setTimeout(
      () => {
        authService.logout();
        setAuthState({
          user: null,
          token: null,
          tokenExpiresAt: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Session expired. Please sign in again.",
          storageType: null,
        });
        navigate("/auth/login", { replace: true });
      },
      Math.min(timeToExpiry, maxTimeout),
    );

    return () => window.clearTimeout(timeout);
  }, [authState.isAuthenticated, authState.tokenExpiresAt, navigate]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const session = await authService.login(credentials);

        setAuthState({
          user: session.user,
          token: session.token,
          tokenExpiresAt: session.expiresAt,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          storageType: session.storageType,
        });

        navigate("/dashboard");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        setAuthState((prev) => ({ ...prev, isLoading: false, error: message }));
        throw err;
      }
    },
    [navigate],
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
        const session = await authService.register(data);

        setAuthState({
          user: session.user,
          token: session.token,
          tokenExpiresAt: session.expiresAt,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          storageType: session.storageType,
        });

        navigate("/dashboard");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Registration failed";
        setAuthState((prev) => ({ ...prev, isLoading: false, error: message }));
        throw err;
      }
    },
    [navigate],
  );

  const logout = useCallback(() => {
    authService.logout();

    setAuthState({
      user: null,
      token: null,
      tokenExpiresAt: null,
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
      authService.updateStoredUser(userData);

      return { ...prev, user: updated };
    });
  }, []);

  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const refreshedSession = await authService.refreshToken();
      if (!refreshedSession) {
        setAuthState((prev) => ({
          ...prev,
          user: null,
          token: null,
          tokenExpiresAt: null,
          isAuthenticated: false,
          storageType: null,
        }));
        return false;
      }

      setAuthState((prev) => ({
        ...prev,
        user: refreshedSession.user,
        token: refreshedSession.token,
        tokenExpiresAt: refreshedSession.expiresAt,
        isAuthenticated: true,
        storageType: refreshedSession.storageType,
      }));

      return true;
    } catch {
      return false;
    }
  }, []);

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
