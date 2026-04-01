import { useEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "../hooks/useAuth";

const AuthProbe = () => {
  const { isAuthenticated, user, token, tokenExpiresAt, login, logout } =
    useAuth();

  useEffect(() => {
    const run = async () => {
      await login({
        email: "demo@example.com",
        password: "password123",
        rememberMe: false,
      });
    };

    void run();
  }, [login]);

  return (
    <div>
      <p data-testid="is-auth">{String(isAuthenticated)}</p>
      <p data-testid="user-email">{user?.email ?? "none"}</p>
      <p data-testid="token">{token ? "present" : "missing"}</p>
      <p data-testid="token-expiry">{tokenExpiresAt ? "present" : "missing"}</p>
      <button onClick={logout}>logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  it("logs in and exposes authenticated state", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthProbe />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("is-auth")).toHaveTextContent("true");
    });

    expect(screen.getByTestId("user-email")).toHaveTextContent(
      "demo@example.com",
    );
    expect(screen.getByTestId("token")).toHaveTextContent("present");
    expect(screen.getByTestId("token-expiry")).toHaveTextContent("present");
  });

  it("clears auth state on logout", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthProbe />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("is-auth")).toHaveTextContent("true");
    });

    screen.getByRole("button", { name: /logout/i }).click();

    await waitFor(() => {
      expect(screen.getByTestId("is-auth")).toHaveTextContent("false");
    });

    expect(screen.getByTestId("user-email")).toHaveTextContent("none");
    expect(screen.getByTestId("token")).toHaveTextContent("missing");
  });
});
