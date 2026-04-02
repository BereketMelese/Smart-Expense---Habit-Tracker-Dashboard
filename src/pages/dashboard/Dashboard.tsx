import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowDownRight,
  CircleDollarSign,
  Plus,
  Flame,
  Target,
  CalendarCheck,
  AlertCircle,
} from "lucide-react";
import Card from "../../components/ui/Card";
import { dashboardService } from "../../services/dashboardService";
import type {
  DashboardSummary,
  HabitProgress,
  RecentTransaction,
} from "../../types/dashboard";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<
    RecentTransaction[]
  >([]);
  const [habits, setHabits] = useState<HabitProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setError(null);

      const [summaryResult, transactionsResult, habitResult] =
        await Promise.allSettled([
          dashboardService.getSummary(),
          dashboardService.getRecentTransactions(),
          dashboardService.getHabitProgress(),
        ]);

      const errors: string[] = [];

      if (summaryResult.status === "fulfilled") {
        setSummary(summaryResult.value);
      } else {
        errors.push(
          summaryResult.reason instanceof Error
            ? summaryResult.reason.message
            : "Failed to load dashboard summary.",
        );
      }

      if (transactionsResult.status === "fulfilled") {
        setRecentTransactions(transactionsResult.value);
      } else {
        errors.push(
          transactionsResult.reason instanceof Error
            ? transactionsResult.reason.message
            : "Failed to load recent transactions.",
        );
      }

      if (habitResult.status === "fulfilled") {
        setHabits(habitResult.value);
      } else {
        errors.push(
          habitResult.reason instanceof Error
            ? habitResult.reason.message
            : "Failed to load habit progress.",
        );
      }

      if (errors.length > 0) {
        setError(errors.join(" "));
      }

      setIsLoading(false);
    };

    void loadDashboard();
  }, []);

  const summaryCards = useMemo(
    () => [
      {
        title: "Current Balance",
        value:
          summary !== null ? `$${summary.currentBalance.toFixed(2)}` : "$0.00",
        change: "Live account balance",
        positive: true,
        icon: CircleDollarSign,
        color: "blue" as const,
      },
      {
        title: "Monthly Spend",
        value:
          summary !== null ? `$${summary.monthlySpend.toFixed(2)}` : "$0.00",
        change: "Current month spending",
        positive: true,
        icon: ArrowDownRight,
        color: "green" as const,
      },
      {
        title: "Habit Streak",
        value: summary !== null ? `${summary.currentStreak} days` : "0 days",
        change: "Current streak across habits",
        positive: true,
        icon: Flame,
        color: "indigo" as const,
      },
    ],
    [summary],
  );

  return (
    <section className="flex-1 p-5 md:p-8 bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-slate-600">
              Track spending, build habits, and keep momentum daily.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-full px-3 py-1.5">
            <CalendarCheck className="h-4 w-4" />
            {new Date().toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </header>

        {error && (
          <Card className="max-w-none" variant="outline" color="red">
            <div className="flex items-start gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">
                  Could not load dashboard
                </p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.title}
                className="max-w-none"
                color={card.color}
                title={card.title}
                icon={Icon}
                hoverable
              >
                <div>
                  {isLoading ? (
                    <div className="h-8 w-28 bg-slate-200 animate-pulse rounded" />
                  ) : (
                    <p className="text-2xl font-bold text-slate-900">
                      {card.value}
                    </p>
                  )}
                  <p className="mt-2 text-sm flex items-center gap-1 text-slate-600">
                    {card.positive ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    {card.change}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card
            className="max-w-none xl:col-span-2"
            title="Recent Transactions"
            description="Latest account activity"
            color="gray"
          >
            <div className="space-y-3">
              {isLoading && (
                <div className="space-y-3">
                  <div className="h-16 rounded-xl border border-slate-200 bg-slate-100 animate-pulse" />
                  <div className="h-16 rounded-xl border border-slate-200 bg-slate-100 animate-pulse" />
                </div>
              )}

              {!isLoading && recentTransactions.length === 0 && (
                <p className="text-sm text-slate-500">
                  No recent transactions found.
                </p>
              )}

              {!isLoading &&
                recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{tx.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {tx.category} •{" "}
                        {new Date(tx.expenseDate).toLocaleDateString()}
                      </p>
                    </div>
                    <p
                      className={`font-semibold ${
                        tx.amount > 0 ? "text-emerald-600" : "text-slate-700"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : "-"}$
                      {Math.abs(tx.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
            </div>
          </Card>

          <Card
            className="max-w-none"
            title="Quick Actions"
            description="Add updates in one click"
            color="blue"
          >
            <div className="space-y-3">
              <button
                onClick={() => navigate("/expenses")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Transaction
              </button>
              <button
                onClick={() => navigate("/habits")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-4 py-3 transition-colors"
              >
                <Target className="h-4 w-4" />
                Add Habit Check-in
              </button>
              <button
                onClick={() => navigate("/reports")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium px-4 py-3 transition-colors"
              >
                View Full Reports
              </button>
            </div>
          </Card>
        </div>

        <Card
          className="max-w-none"
          title="Habit Progress"
          description="This month"
          color="green"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoading && (
              <div className="md:col-span-3 h-24 rounded-xl border border-slate-200 bg-slate-100 animate-pulse" />
            )}

            {!isLoading && habits.length === 0 && (
              <p className="text-sm text-slate-500">
                No habit progress available yet.
              </p>
            )}

            {!isLoading &&
              habits.map((habit) => (
                <div
                  key={habit.habitId}
                  className="rounded-xl border border-slate-200 p-4 bg-white"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-slate-800">
                      {habit.habitName}
                    </p>
                    <span className="text-xs text-slate-500">
                      {habit.progressPercent}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${habit.progressPercent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {habit.currentCount}/{habit.targetCount} completed
                  </p>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Dashboard;
