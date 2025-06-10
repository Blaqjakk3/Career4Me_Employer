"use client";
import { useState } from "react";
import Sidebar from "../../components/sidebar";

export default function ProfileLayout({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Custom setter that persists to localStorage
  const handleSetCollapsed = (newCollapsed) => {
    setCollapsed(newCollapsed);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newCollapsed));
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar receives the collapsed state and toggle function */}
      <Sidebar collapsed={collapsed} setCollapsed={handleSetCollapsed} />

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