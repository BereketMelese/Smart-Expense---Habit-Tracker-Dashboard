import React from "react";
import Navigation from "./Navigation";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = "Smart Expense & Habit Tracker",
}) => {
  return (
    <header>
      <div className="h-16 bg-linear-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-center md:justify-start">
          <h1 className="text-xl sm:text-2xl font-bold hidden md:block">
            {title}
          </h1>
          <h1 className="text-xl font-bold md:hidden">ExpenseTracker</h1>
        </div>
      </div>

      {/* Navigation */}
      <Navigation />
    </header>
  );
};

export default Header;
