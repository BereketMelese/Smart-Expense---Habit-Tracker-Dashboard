import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Reports from "./Reports";

vi.mock("../../services/dashboardService", () => ({
  dashboardService: {
    getSummary: vi.fn(),
    getHabitProgress: vi.fn(),
  },
}));

vi.mock("../../services/expensesService", () => ({
  expensesService: {
    list: vi.fn(),
  },
}));

import { dashboardService } from "../../services/dashboardService";
import { expensesService } from "../../services/expensesService";

describe("Reports partial loading", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows available report sections when summary request fails", async () => {
    vi.mocked(dashboardService.getSummary).mockRejectedValue(
      new Error("Summary unavailable"),
    );
    vi.mocked(dashboardService.getHabitProgress).mockResolvedValue([
      {
        habitId: "h1",
        habitName: "Workout",
        targetType: "WEEKLY",
        targetCount: 3,
        currentCount: 2,
        progressPercent: 67,
        color: "#10b981",
      },
    ]);
    vi.mocked(expensesService.list).mockResolvedValue({
      items: [
        {
          id: "e1",
          title: "Groceries",
          amount: 82.75,
          category: "Food",
          expenseDate: "2026-04-02T00:00:00.000Z",
          notes: null,
        },
      ],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
    });

    render(<Reports />);

    await waitFor(() => {
      expect(screen.getByText(/summary unavailable/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/top expenses/i)).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
  });
});
