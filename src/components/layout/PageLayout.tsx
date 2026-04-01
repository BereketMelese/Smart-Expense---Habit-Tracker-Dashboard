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
    "/profile",
  ].some((path) => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        {(shouldShowSidebar || sidebar) && (
          <aside className="hidden md:block w-72 shrink-0 border-r border-slate-200">
            {sidebar ?? <Sidebar />}
          </aside>
        )}
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
