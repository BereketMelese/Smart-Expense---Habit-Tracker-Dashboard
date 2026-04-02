// components/layout/Header.tsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart,
  Menu,
  X,
  Wallet,
  Target,
  User,
  CalendarDays,
  FileBarChart2,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
  }, [location.pathname]);

  const primaryNavItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      path: "/expenses",
      label: "Expenses",
      icon: <Wallet className="h-4 w-4" />,
    },
    { path: "/habits", label: "Habits", icon: <Target className="h-4 w-4" /> },
  ];

  const secondaryNavItems = [
    {
      path: "/calendar",
      label: "Calendar",
      icon: <CalendarDays className="h-4 w-4" />,
    },
    {
      path: "/reports",
      label: "Reports",
      icon: <FileBarChart2 className="h-4 w-4" />,
    },
    { path: "/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  ];

  const isActiveRoute = (path: string) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(path));

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 overflow-x-clip bg-linear-to-r from-slate-900 via-blue-900 to-indigo-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)]">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex h-16 items-center gap-3 min-w-0">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 min-w-0 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-2xl bg-white/18 backdrop-blur-sm ring-1 ring-white/20 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <BarChart className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-[10px] uppercase tracking-[0.32em] text-blue-50/70">
                Smart finance
              </p>
              <p className="text-xl font-bold">
                Expense <span className="text-blue-100">Tracker</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 min-w-0 items-center justify-end gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-1 rounded-full bg-white/8 p-1 ring-1 ring-white/10 backdrop-blur-sm">
                  {primaryNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 shrink-0 ${
                        isActiveRoute(item.path)
                          ? "bg-white text-blue-800 shadow-sm"
                          : "text-white/90 hover:bg-white/12"
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setMoreMenuOpen((value) => !value)}
                      className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 shrink-0 ${
                        [...secondaryNavItems, { path: "/profile" }].some(
                          (item) => isActiveRoute(item.path),
                        )
                          ? "bg-white text-blue-800 shadow-sm"
                          : "text-white/90 hover:bg-white/12"
                      }`}
                    >
                      <span>More</span>
                      {moreMenuOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    <div
                      className={`absolute right-0 mt-2 w-68 overflow-hidden rounded-3xl bg-white text-slate-800 shadow-2xl ring-1 ring-slate-200 origin-top-right transform-gpu transition-all duration-150 ease-out ${
                        moreMenuOpen
                          ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                          : "pointer-events-none -translate-y-1 scale-95 opacity-0"
                      }`}
                      aria-hidden={!moreMenuOpen}
                    >
                      <div className="bg-linear-to-r from-slate-50 to-blue-50/70 px-4 py-3 border-b border-slate-100">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                          More
                        </p>
                      </div>

                      <div className="p-2 space-y-2">
                        {secondaryNavItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors border ${
                              isActiveRoute(item.path)
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : "border-transparent hover:bg-slate-50 hover:border-slate-100"
                            }`}
                          >
                            <span className="rounded-xl bg-slate-100 p-2 text-slate-500 shadow-sm">
                              {item.icon}
                            </span>
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        ))}

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors border border-transparent hover:bg-red-50 hover:border-red-100 text-red-600"
                        >
                          <span className="rounded-xl bg-red-50 p-2 text-red-500 shadow-sm">
                            <LogOut className="h-4 w-4" />
                          </span>
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10 backdrop-blur-sm shrink-0">
                  <div className="w-8 h-8 rounded-full bg-white/18 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 leading-tight">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-blue-50/80 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="px-4 py-2 bg-white text-blue-800 rounded-full hover:bg-blue-50 transition-colors font-medium flex items-center gap-2 shrink-0 shadow-sm"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 border border-white/40 rounded-full hover:bg-white/10 transition-colors font-medium flex items-center gap-2 shrink-0"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden ml-auto p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="mt-4 rounded-3xl border border-white/15 bg-slate-950/35 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="px-4 py-4 border-b border-white/10 bg-white/5">
                <p className="text-xs uppercase tracking-[0.28em] text-blue-100/70">
                  Navigation
                </p>
                <p className="mt-1 text-sm text-white/85">
                  Quick access to your workspace
                </p>
              </div>

              {isAuthenticated ? (
                <div className="p-3 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {primaryNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`rounded-2xl px-3 py-3 flex items-center gap-3 transition-all border ${
                          isActiveRoute(item.path)
                            ? "bg-white text-blue-700 border-white shadow-sm"
                            : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{item.icon}</span>
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                    <Link
                      to="/calendar"
                      className={`rounded-2xl px-3 py-3 flex items-center gap-3 transition-all border ${
                        isActiveRoute("/calendar")
                          ? "bg-white text-blue-700 border-white shadow-sm"
                          : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <CalendarDays className="h-5 w-5" />
                      <span className="text-sm font-medium">Calendar</span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/reports"
                      className={`rounded-2xl px-3 py-3 flex items-center gap-3 transition-all border ${
                        isActiveRoute("/reports")
                          ? "bg-white text-blue-700 border-white shadow-sm"
                          : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FileBarChart2 className="h-5 w-5" />
                      <span className="text-sm font-medium">Reports</span>
                    </Link>
                    <Link
                      to="/profile"
                      className={`rounded-2xl px-3 py-3 flex items-center gap-3 transition-all border ${
                        isActiveRoute("/profile")
                          ? "bg-white text-blue-700 border-white shadow-sm"
                          : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span className="text-sm font-medium">Profile</span>
                    </Link>
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-blue-100/80 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors shrink-0"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  <Link
                    to="/auth/login"
                    className="flex items-center justify-center px-4 py-3 bg-white text-blue-800 rounded-2xl hover:bg-blue-50 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                  <Link
                    to="/auth/register"
                    className="flex items-center justify-center px-4 py-3 border border-white/30 rounded-2xl hover:bg-white/10 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
