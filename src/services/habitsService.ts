import { apiClient } from "./apiClient";
import type { Habit, HabitCheckIn, HabitInput } from "../types/habit";

export const habitsService = {
  list() {
    return apiClient.request<Habit[]>("/habits");
  },

  create(payload: HabitInput) {
    return apiClient.request<Habit>("/habits", {
      method: "POST",
      body: payload,
    });
  },

  update(id: string, payload: HabitInput) {
    return apiClient.request<Habit>(`/habits/${id}`, {
      method: "PUT",
      body: payload,
    });
  },

  remove(id: string) {
    return apiClient.request<void>(`/habits/${id}`, {
      method: "DELETE",
    });
  },

  addCheckIn(id: string, checkInDate?: string) {
    return apiClient.request<HabitCheckIn>(`/habits/${id}/check-ins`, {
      method: "POST",
      body: checkInDate ? { checkInDate } : {},
    });
  },

  getCheckIns(id: string) {
    return apiClient.request<HabitCheckIn[]>(`/habits/${id}/check-ins`);
  },
};
