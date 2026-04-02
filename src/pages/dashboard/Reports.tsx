import React, { useEffect, useMemo, useState } from "react";
import { FileBarChart2, AlertCircle } from "lucide-react";
import Card from "../../components/ui/Card";
import { dashboardService } from "../../services/dashboardService";
import { expensesService } from "../../services/expensesService";
import type { Expense } from "../../types/expense";
import type { DashboardSummary, HabitProgress } from "../../types/dashboard";

const Reports: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [habitProgress, setHabitProgress] = useState<HabitProgress[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [summaryData, habitsData, expensesData] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getHabitProgress(),
          expensesService.list(),
        ]);

        setSummary(summaryData);
        setHabitProgress(habitsData);
        setExpenses(expensesData.items);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load report data",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadReports();
  }, []);

  const spendByCategory = useMemo(() => {
    const totals = new Map<string, number>();
    expenses.forEach((expense) => {
      const current = totals.get(expense.category) ?? 0;
      totals.set(expense.category, current + Number(expense.amount));
    });

    return Array.from(totals.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  const topExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .slice(0, 5);
  }, [expenses]);

  const avgHabitProgress = useMemo(() => {
    if (habitProgress.length === 0) return 0;
    const sum = habitProgress.reduce(
      (acc, item) => acc + item.progressPercent,
      0,
    );
    return Math.round(sum / habitProgress.length);
  }, [habitProgress]);

  return (
    <section className="flex-1 p-5 md:p-8 bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card
          className="max-w-none"
          title="Reports"
          description="Spending and habit performance insights"
          icon={FileBarChart2}
          color="purple"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-slate-500">Balance</p>
              <p className="mt-1 text-2xl font-semibold">
                {isLoading || !summary
                  ? "--"
                  : `$${summary.currentBalance.toFixed(2)}`}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-slate-500">Monthly Spend</p>
              <p className="mt-1 text-2xl font-semibold">
                {isLoading || !summary
                  ? "--"
                  : `$${summary.monthlySpend.toFixed(2)}`}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-slate-500">Current Streak</p>
              <p className="mt-1 text-2xl font-semibold">
                {isLoading || !summary ? "--" : `${summary.currentStreak}d`}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-slate-500">Avg Habit Progress</p>
              <p className="mt-1 text-2xl font-semibold">
                {isLoading ? "--" : `${avgHabitProgress}%`}
              </p>
            </div>
          </div>
        </Card>

        {error && (
          <Card className="max-w-none" variant="outline" color="red">
            <div className="flex items-start gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card className="max-w-none" title="Spend by Category" color="blue">
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-10 rounded-lg bg-slate-100 animate-pulse" />
                <div className="h-10 rounded-lg bg-slate-100 animate-pulse" />
              </div>
            ) : spendByCategory.length === 0 ? (
              <p className="text-sm text-slate-500">
                No expense categories available.
              </p>
            ) : (
              <div className="space-y-3">
                {spendByCategory.map((item) => {
                  const max = spendByCategory[0]?.total || 1;
                  const percent = Math.max(
                    6,
                    Math.round((item.total / max) * 100),
                  );

                  return (
                    <div key={item.category}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">
                          {item.category}
                        </span>
                        <span className="text-slate-600">
                          ${item.total.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="max-w-none" title="Top Expenses" color="green">
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-12 rounded-lg bg-slate-100 animate-pulse" />
                <div className="h-12 rounded-lg bg-slate-100 animate-pulse" />
              </div>
            ) : topExpenses.length === 0 ? (
              <p className="text-sm text-slate-500">No expenses available.</p>
            ) : (
              <div className="space-y-2">
                {topExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-800">
                        {expense.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {expense.category}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-800">
                      ${Number(expense.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Reports;
