import React from "react";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  title?: string;
}

const PageLayout: React.FC<LayoutProps> = ({
  children,
  sidebar,
  title = "Smart Expense & Habit Tracker",
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title={title} />
      <div className="flex-1 flex">
        {sidebar && (
          <aside className="w-full md:w-64 bg-gray-800 p-4">{sidebar}</aside>
        )}
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </div>
  );
};

export default PageLayout;
