import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
interface LayoutProps {
  sidebar?: React.ReactNode;
}

const PageLayout: React.FC<LayoutProps> = ({ sidebar }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        {sidebar && (
          <aside className="w-full md:w-64 bg-gray-800 p-4">{sidebar}</aside>
        )}
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
