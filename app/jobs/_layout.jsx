"use client";
import { useState } from "react";
import Sidebar from "../../components/sidebar";

export default function JobsLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar receives the collapsed state and toggle function */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Content shifts dynamically based on sidebar state */}
      <main
        className={`
          flex-1 overflow-y-auto transition-all duration-300 ease-in-out
          ${collapsed ? "ml-20 w-[calc(100%-5rem)]" : "ml-64 w-[calc(100%-16rem)]"}
        `}
      >
        <div className="p-4 md:p-6 w-full">{children}</div>
      </main>
    </div>
  );
}
