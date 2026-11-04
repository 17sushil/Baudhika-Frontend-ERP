"use client";

import * as React from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { cn } from "cn";

interface DashboardShellContextValue {
  selectedBranchId: string;
  setSelectedBranchId: (id: string) => void;
}

const DashboardShellContext = React.createContext<DashboardShellContextValue>({
  selectedBranchId: "ktm",
  setSelectedBranchId: () => {},
});

export function useDashboardShell() {
  return React.useContext(DashboardShellContext);
}

export function DashboardLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedBranchId, setSelectedBranchId] = React.useState("ktm");

  return (
    <DashboardShellContext.Provider
      value={{ selectedBranchId, setSelectedBranchId }}
    >
      <div className="min-h-screen bg-[#F5F8FC] text-slate-900 font-sans antialiased">
        {/* Navy Collapsible Sidebar */}
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Main Content Area */}
        <div
          className={cn(
            "flex min-h-screen flex-col transition-all duration-200 ease-in-out",
            collapsed ? "lg:pl-20" : "lg:pl-64"
          )}
        >
          {/* Top Navigation Bar */}
          <AdminTopbar
            onOpenMobileSidebar={() => setMobileOpen(true)}
            selectedBranchId={selectedBranchId}
            onSelectBranch={setSelectedBranchId}
          />

          {/* Page Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </DashboardShellContext.Provider>
  );
}
