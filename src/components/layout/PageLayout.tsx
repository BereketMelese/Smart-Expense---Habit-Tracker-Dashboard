import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
interface LayoutProps {
  sidebar?: React.ReactNode;
}

const PageLayout: React.FC<LayoutProps> = ({ sidebar }) => {
  const location = useLocation();
  const shouldShowSidebar = [
    "/dashboard",
    "/expenses",
    "/habits",
    "/calendar",
    "/reports",
    "/profile",
  ].some((path) => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-slate-50">
      <Header />
      <div className="relative flex-1 flex min-w-0 bg-linear-to-br from-slate-50 via-white to-blue-50/50">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 right-[-6rem] h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />
          <div className="absolute top-1/3 left-[-8rem] h-80 w-80 rounded-full bg-indigo-200/15 blur-3xl" />
        </div>

        {(shouldShowSidebar || sidebar) && (
          <aside className="hidden md:block w-72 shrink-0 border-r border-white/60 bg-white/75 backdrop-blur-xl shadow-[8px_0_30px_rgba(15,23,42,0.04)]">
            <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
              {sidebar ?? <Sidebar />}
            </div>
          </aside>
        )}
        <main className="relative flex-1 flex flex-col min-w-0">
          <div className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-5 md:px-6 md:py-6 lg:px-8">
            <div className="min-h-full rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm overflow-hidden">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
