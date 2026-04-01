export interface DashboardSummary {
  currentBalance: number;
  monthlySpend: number;
  currentStreak: number;
}

export interface RecentTransaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  expenseDate: string;
  notes?: string | null;
}

export interface HabitProgress {
  habitId: string;
  habitName: string;
  targetType: "DAILY" | "WEEKLY" | "MONTHLY";
  targetCount: number;
  currentCount: number;
  progressPercent: number;
  color?: string;
}
