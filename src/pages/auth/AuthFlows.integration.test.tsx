import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "../../context/AuthContext";
import Login from "./Login";
import Register from "./Register";

const renderWithAuthRoutes = (ui: React.ReactNode, initialPath: string) => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route path="/auth/login" element={ui} />
          <Route path="/auth/register" element={ui} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
};

describe("Auth flows", () => {
  it("completes login flow with valid credentials", async () => {
    const user = userEvent.setup();
    renderWithAuthRoutes(<Login />, "/auth/login");

    await user.type(
      screen.getByPlaceholderText("you@example.com"),
      "demo@example.com",
    );
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");

    await user.click(
      screen.getByRole("button", { name: /sign in to your account/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/login successful/i)).toBeInTheDocument();
    });
  });

  it("completes register flow with valid input", async () => {
    const user = userEvent.setup();
    renderWithAuthRoutes(<Register />, "/auth/register");

    const passwordInputs = screen.getAllByPlaceholderText("••••••••");

    await user.type(screen.getByPlaceholderText("John Doe"), "Test User");
    await user.type(
      screen.getByPlaceholderText("you@example.com"),
      "newuser@example.com",
    );
    await user.type(passwordInputs[0], "Password123");
    await user.type(passwordInputs[1], "Password123");
    await user.click(screen.getByLabelText(/i agree to the/i));

    await user.click(
      screen.getByRole("button", { name: /create your free account/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
  });
});
