"use client";

import { useState } from "react";
import { SideBar } from "@/components/navigation/SideBar";
import { Header } from "@/components/dashboard/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideBar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onCollapseChange={(collapsed) => setSidebarCollapsed(collapsed)}
      />

      <div
        className={`
          flex-1 flex flex-col transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}
        `}
      >
        <Header onMenuToggle={toggleSidebar} userName="Fatou" />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
