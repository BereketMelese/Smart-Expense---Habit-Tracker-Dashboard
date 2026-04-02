import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, AlertCircle } from "lucide-react";
import Card from "../../components/ui/Card";
import { expensesService } from "../../services/expensesService";
import { habitsService } from "../../services/habitsService";

interface DayStats {
  dateKey: string;
  label: string;
  expenseTotal: number;
  expenseCount: number;
  checkInCount: number;
}

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});

const CalendarPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dayStats, setDayStats] = useState<DayStats[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [expenses, habits] = await Promise.all([
          expensesService.list(),
          habitsService.list(),
        ]);

        const checkInGroups = await Promise.all(
          habits.map(async (habit) => {
            try {
              return await habitsService.getCheckIns(habit.id);
            } catch {
              return [];
            }
          }),
        );

        const byDate = new Map<string, DayStats>();

        const ensureDay = (dateKey: string) => {
          const existing = byDate.get(dateKey);
          if (existing) return existing;

          const day = new Date(dateKey);
          const next: DayStats = {
            dateKey,
            label: DATE_FORMATTER.format(day),
            expenseTotal: 0,
            expenseCount: 0,
            checkInCount: 0,
          };
          byDate.set(dateKey, next);
          return next;
        };

        expenses.items.forEach((expense) => {
          const dateKey = expense.expenseDate.slice(0, 10);
          const day = ensureDay(dateKey);
          day.expenseTotal += Number(expense.amount);
          day.expenseCount += 1;
        });

        checkInGroups.flat().forEach((checkIn) => {
          const dateKey = checkIn.checkInDate.slice(0, 10);
          const day = ensureDay(dateKey);
          day.checkInCount += 1;
        });

        const today = new Date();
        const recent14Days = Array.from({ length: 14 }).map((_, index) => {
          const date = new Date(today);
          date.setDate(today.getDate() - (13 - index));
          const dateKey = date.toISOString().slice(0, 10);
          const fromData = byDate.get(dateKey);

          return (
            fromData ?? {
              dateKey,
              label: DATE_FORMATTER.format(date),
              expenseTotal: 0,
              expenseCount: 0,
              checkInCount: 0,
            }
          );
        });

        setDayStats(recent14Days);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load calendar data",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  const totals = useMemo(() => {
    return dayStats.reduce(
      (acc, day) => {
        acc.expenseTotal += day.expenseTotal;
        acc.expenseCount += day.expenseCount;
        acc.checkInCount += day.checkInCount;
        return acc;
      },
      { expenseTotal: 0, expenseCount: 0, checkInCount: 0 },
    );
  }, [dayStats]);

  return (
    <section className="flex-1 p-5 md:p-8 bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card
          className="max-w-none"
          title="Calendar"
          description="Last 14 days of spending and habit check-ins"
          icon={CalendarDays}
          color="indigo"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-slate-500">Expenses</p>
              <p className="mt-1 text-2xl font-semibold">
                {totals.expenseCount}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-slate-500">Check-ins</p>
              <p className="mt-1 text-2xl font-semibold">
                {totals.checkInCount}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-slate-500">Spend Total</p>
              <p className="mt-1 text-2xl font-semibold">
                ${totals.expenseTotal.toFixed(2)}
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

        <Card className="max-w-none" title="Daily Activity" color="gray">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 rounded-lg border border-slate-200 bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {dayStats.map((day) => (
                <div
                  key={day.dateKey}
                  className="rounded-lg border border-slate-200 bg-white p-4"
                >
                  <p className="text-sm font-medium text-slate-800">
                    {day.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {day.expenseCount} expenses • {day.checkInCount} check-ins
                  </p>
                  <p className="text-sm font-semibold text-slate-900 mt-2">
                    ${day.expenseTotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};

export default CalendarPage;
