import { apiClient } from "./apiClient";
import type { Income, IncomeInput, IncomeListResponse } from "../types/income";

export const incomesService = {
  list() {
    return apiClient.request<IncomeListResponse>("/incomes");
  },

  create(payload: IncomeInput) {
    return apiClient.request<Income>("/incomes", {
      method: "POST",
      body: payload,
    });
  },

  update(id: string, payload: IncomeInput) {
    return apiClient.request<Income>(`/incomes/${id}`, {
      method: "PUT",
      body: payload,
    });
  },

  remove(id: string) {
    return apiClient.request<void>(`/incomes/${id}`, {
      method: "DELETE",
    });
  },
};
