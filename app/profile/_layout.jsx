"use client";
import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import NotificationModal from "../../components/NotificationModal";

export default function ProfileLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false); // Always start with false to avoid hydration mismatch
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side initialization
  useEffect(() => {
    setIsClient(true);
    // Initialize from localStorage after component mounts
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) {
      setCollapsed(JSON.parse(saved));
    }
  }, []);

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
      <Sidebar
        collapsed={collapsed}
        setCollapsed={handleSetCollapsed}
        onNotificationClick={() => setShowNotificationModal(true)}
      />

      {/* Content shifts dynamically based on sidebar state */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
          isClient && collapsed ? "ml-20 w-[calc(100%-5rem)]" : "ml-64 w-[calc(100%-16rem)]"
        }`}
      >
        <div className="p-4 md:p-6 w-full">{children}</div>
      </main>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />
    </div>
  );
}