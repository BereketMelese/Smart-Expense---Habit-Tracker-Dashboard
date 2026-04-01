import { apiClient } from "./apiClient";
import type { Expense, ExpenseInput } from "../types/expense";

export const expensesService = {
  list() {
    return apiClient.request<Expense[]>("/expenses");
  },

  create(payload: ExpenseInput) {
    return apiClient.request<Expense>("/expenses", {
      method: "POST",
      body: payload,
    });
  },

  update(id: string, payload: ExpenseInput) {
    return apiClient.request<Expense>(`/expenses/${id}`, {
      method: "PUT",
      body: payload,
    });
  },

  remove(id: string) {
    return apiClient.request<void>(`/expenses/${id}`, {
      method: "DELETE",
    });
  },
};
