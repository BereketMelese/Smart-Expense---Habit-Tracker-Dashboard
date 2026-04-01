import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Wallet, Target, User, Flag } from "lucide-react";

const navItems = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Expenses", to: "/expenses", icon: Wallet },
  { label: "Habits", to: "/habits", icon: Target },
  { label: "Profile", to: "/profile", icon: User },
];

const Sidebar: React.FC = () => {
  return (
    <div className="h-full bg-slate-900 text-slate-100 p-4 md:p-5">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-slate-400">
          Workspace
        </p>
        <h2 className="text-lg font-semibold mt-1">Money + Habits</h2>
      </div>

      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-800/80 p-4">
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-amber-300" />
          <p className="text-sm font-medium">Today Goal</p>
        </div>
        <p className="mt-2 text-xs text-slate-300">
          Keep spending under $45 and complete 2 habits.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
