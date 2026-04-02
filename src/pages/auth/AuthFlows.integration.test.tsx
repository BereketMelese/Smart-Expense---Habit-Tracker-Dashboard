import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "../../context/AuthContext";
import ForgotPassword from "./ForgotPassword";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import Register from "./Register";

const renderWithAuthRoutes = (initialPath: string) => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
};

describe("Auth flows", () => {
  it("completes login flow with valid credentials", async () => {
    const user = userEvent.setup();
    renderWithAuthRoutes("/auth/login");

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
    renderWithAuthRoutes("/auth/register");

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

  it("completes forgot and reset password flow", async () => {
    const user = userEvent.setup();
    renderWithAuthRoutes("/auth/forgot-password");

    const emailInput = await screen.findByPlaceholderText("you@example.com");
    await user.type(emailInput, "demo@example.com");

    await user.click(
      screen.getByRole("button", { name: /send reset instructions/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: /continue to reset password/i }),
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("link", { name: /continue to reset password/i }),
    );

    const [passwordInput, confirmPasswordInput] =
      screen.getAllByPlaceholderText("••••••••");

    await user.type(passwordInput, "NewPassword123");
    await user.type(confirmPasswordInput, "NewPassword123");

    await user.click(screen.getByRole("button", { name: /update password/i }));

    await waitFor(() => {
      expect(screen.getByText(/password updated/i)).toBeInTheDocument();
    });
  });
});
