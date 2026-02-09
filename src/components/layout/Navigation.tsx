import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, LogIn, UserPlus, BarChart, Wallet, Target } from "lucide-react";

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      path: "/expenses",
      label: "Expenses",
      icon: <Wallet className="h-5 w-5" />,
    },
    { path: "/habits", label: "Habits", icon: <Target className="h-5 w-5" /> },
    { path: "/login", label: "Login", icon: <LogIn className="h-5 w-5" /> },
    {
      path: "/register",
      label: "Register",
      icon: <UserPlus className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">
                Expense<span className="text-blue-600">Tracker</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-600 hover:text-gray-900">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
