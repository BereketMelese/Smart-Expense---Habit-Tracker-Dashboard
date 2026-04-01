import React from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  CircleDollarSign,
  Plus,
  Flame,
  Target,
  CalendarCheck,
} from "lucide-react";
import Card from "../../components/ui/Card";

const Dashboard: React.FC = () => {
  const summaryCards = [
    {
      title: "Current Balance",
      value: "$4,820.50",
      change: "+8.2% vs last month",
      positive: true,
      icon: CircleDollarSign,
      color: "blue" as const,
    },
    {
      title: "Monthly Spend",
      value: "$1,274.20",
      change: "-4.6% vs last month",
      positive: true,
      icon: ArrowDownRight,
      color: "green" as const,
    },
    {
      title: "Habit Streak",
      value: "19 days",
      change: "2 habits completed today",
      positive: true,
      icon: Flame,
      color: "indigo" as const,
    },
  ];

  const recentTransactions = [
    {
      id: "t1",
      label: "Groceries - Fresh Market",
      category: "Food",
      date: "Today",
      amount: -64.25,
    },
    {
      id: "t2",
      label: "Salary Deposit",
      category: "Income",
      date: "Yesterday",
      amount: 2450.0,
    },
    {
      id: "t3",
      label: "Internet Subscription",
      category: "Bills",
      date: "Mar 30",
      amount: -49.99,
    },
    {
      id: "t4",
      label: "Coffee with Team",
      category: "Lifestyle",
      date: "Mar 30",
      amount: -14.8,
    },
  ];

  const habits = [
    { name: "No Spend Day", progress: 80, completed: 24, target: 30 },
    { name: "Workout", progress: 67, completed: 20, target: 30 },
    { name: "Read 20 minutes", progress: 90, completed: 27, target: 30 },
  ];

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
            Apr 1, 2026
          </div>
        </header>

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
                  <p className="text-2xl font-bold text-slate-900">
                    {card.value}
                  </p>
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
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-800">{tx.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {tx.category} • {tx.date}
                    </p>
                  </div>
                  <p
                    className={`font-semibold ${
                      tx.amount > 0 ? "text-emerald-600" : "text-slate-700"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
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
              <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 transition-colors">
                <Plus className="h-4 w-4" />
                Add Transaction
              </button>
              <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-4 py-3 transition-colors">
                <Target className="h-4 w-4" />
                Add Habit Check-in
              </button>
              <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium px-4 py-3 transition-colors">
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
            {habits.map((habit) => (
              <div
                key={habit.name}
                className="rounded-xl border border-slate-200 p-4 bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-800">{habit.name}</p>
                  <span className="text-xs text-slate-500">
                    {habit.progress}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${habit.progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {habit.completed}/{habit.target} days completed
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
