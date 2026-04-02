import { beforeEach, describe, expect, it, vi } from "vitest";
import { expensesService } from "./expensesService";

describe("expensesService.list", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.setItem("auth_token", "token-123");
  });

  it("returns paginated expense list contract", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        message: "Expenses fetched",
        data: {
          items: [
            {
              id: "e1",
              title: "Lunch",
              amount: 14.5,
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
        },
      }),
    } as Response);

    const result = await expensesService.list();

    expect(result.items).toHaveLength(1);
    expect(result.items[0].title).toBe("Lunch");
    expect(result.pagination.total).toBe(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:4000/api/expenses",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: "Bearer token-123",
        }),
      }),
    );
  });
});
