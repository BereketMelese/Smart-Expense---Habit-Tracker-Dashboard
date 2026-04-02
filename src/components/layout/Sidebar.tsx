import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  Target,
  User,
  CalendarDays,
  FileBarChart2,
  Flag,
} from "lucide-react";

const mainNavItems = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Expenses", to: "/expenses", icon: Wallet },
  { label: "Habits", to: "/habits", icon: Target },
];

const moreNavItems = [
  { label: "Calendar", to: "/calendar", icon: CalendarDays },
  { label: "Reports", to: "/reports", icon: FileBarChart2 },
  { label: "Profile", to: "/profile", icon: User },
];

const Sidebar: React.FC = () => {
  return (
    <div className="h-full bg-transparent text-slate-100 p-4 md:p-5">
      <div className="rounded-[1.75rem] border border-white/10 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 p-4 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.12),transparent_28%)]" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
            Workspace
          </p>
          <h2 className="mt-2 text-lg font-semibold">Money + Habits</h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-xs">
            Track spending, habits, and progress without losing the big picture.
          </p>
        </div>
      </div>

      <nav className="mt-5 space-y-4">
        <div>
          <p className="px-2 text-xs uppercase tracking-[0.24em] text-slate-500">
            Main
          </p>
          <div className="mt-2 space-y-2">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2.5 rounded-2xl border transition-all duration-200 ${
                      isActive
                        ? "bg-white text-slate-900 border-white shadow-[0_8px_20px_rgba(15,23,42,0.15)]"
                        : "text-slate-200 border-transparent hover:bg-white/10 hover:text-black hover:border-white/10 hover:translate-x-0.5 hover:shadow-[0_6px_16px_rgba(15,23,42,0.18)]"
                    }`
                  }
                >
                  <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div>
          <p className="px-2 text-xs uppercase tracking-[0.24em] text-slate-500">
            More
          </p>
          <div className="mt-2 space-y-2">
            {moreNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2.5 rounded-2xl border transition-all duration-200 ${
                      isActive
                        ? "bg-slate-800 text-white border-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.18)]"
                        : "text-slate-300 border-transparent hover:bg-white/10 hover:text-black hover:border-white/10 hover:translate-x-0.5 hover:shadow-[0_6px_16px_rgba(15,23,42,0.18)]"
                    }`
                  }
                >
                  <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-950/85 p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-amber-300" />
          <p className="text-sm font-medium">Today Goal</p>
        </div>
        <p className="mt-2 text-xs text-slate-300 leading-relaxed">
          Keep spending under $45 and complete 2 habits.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
