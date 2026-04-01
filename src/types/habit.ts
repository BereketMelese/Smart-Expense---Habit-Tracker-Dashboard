export type HabitTargetType = "DAILY" | "WEEKLY" | "MONTHLY";

export interface Habit {
  id: string;
  name: string;
  targetType: HabitTargetType;
  targetCount: number;
  color?: string;
  createdAt?: string;
}

export interface HabitInput {
  name: string;
  targetType: HabitTargetType;
  targetCount: number;
  color?: string;
}

export interface HabitCheckIn {
  id: string;
  habitId: string;
  checkInDate: string;
  note?: string | null;
}
