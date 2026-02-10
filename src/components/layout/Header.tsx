import React from "react";
import { Link } from "react-router-dom";
import { BarChart, Menu } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <BarChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">Expense</span>
              <span className="text-xl font-bold text-blue-200">Tracker</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/expenses"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Expenses
            </Link>
            <Link
              to="/habits"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Habits
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 border-2 border-white rounded-lg hover:bg-white/20 transition-colors font-medium"
            >
              Register
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-white/10">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
