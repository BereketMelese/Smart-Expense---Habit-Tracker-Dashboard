import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "./Dashboard";

vi.mock("../../services/dashboardService", () => ({
  dashboardService: {
    getSummary: vi.fn(),
    getRecentTransactions: vi.fn(),
    getHabitProgress: vi.fn(),
  },
}));

import { dashboardService } from "../../services/dashboardService";

describe("Dashboard partial loading", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders available data when one request fails", async () => {
    vi.mocked(dashboardService.getSummary).mockRejectedValue(
      new Error("Summary endpoint failed"),
    );
    vi.mocked(dashboardService.getRecentTransactions).mockResolvedValue([
      {
        id: "t1",
        title: "Coffee",
        amount: 4.25,
        category: "Food",
        expenseDate: "2026-04-02T00:00:00.000Z",
        notes: null,
      },
    ]);
    vi.mocked(dashboardService.getHabitProgress).mockResolvedValue([
      {
        habitId: "h1",
        habitName: "Read",
        targetType: "DAILY",
        targetCount: 1,
        currentCount: 1,
        progressPercent: 100,
        color: "#0ea5e9",
      },
    ]);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/could not load dashboard/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/summary endpoint failed/i)).toBeInTheDocument();
    expect(screen.getByText("Coffee")).toBeInTheDocument();
    expect(screen.getByText("Read")).toBeInTheDocument();
  });
});
