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

    const emailInput = await screen.findByPlaceholderText("you@example.com");
    const passwordInput = await screen.findByPlaceholderText("••••••••");

    await user.type(emailInput, "demo@example.com");
    await user.type(passwordInput, "password123");

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

    const fullNameInput = await screen.findByPlaceholderText("John Doe");
    const emailInput = await screen.findByPlaceholderText("you@example.com");
    const passwordInputs = await screen.findAllByPlaceholderText("••••••••");

    await user.type(fullNameInput, "Test User");
    await user.type(emailInput, "newuser@example.com");
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
