"use client";

import * as React from "react";
import {
  Calendar,
  Download,
  Sliders,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  X,
  ChevronRight,
  TrendingUp,
  School,
} from "lucide-react";
import { QuickActionsBar } from "./quick-actions-bar";
import { KpiSummaryCards } from "./kpi-summary-cards";
import { AnalyticsCharts } from "./analytics-charts";
import { BranchComparisonTable } from "./branch-comparison-table";
import { NotificationsPanel } from "./notifications-panel";
import {
  CustomizeDashboardModal,
  type DashboardWidgetsState,
} from "./customize-dashboard-modal";
import { toast } from "sonner";
import { useOptionalTenant } from "@/providers/tenant-provider";
import { cn } from "cn";

interface DashboardContentProps {
  selectedBranchId: string;
  onSelectBranch: (id: string) => void;
}

export function DashboardContent({
  selectedBranchId,
  onSelectBranch,
}: DashboardContentProps) {
  const tenantCtx = useOptionalTenant();
  const schoolName = tenantCtx?.tenant?.name ?? "Baudhika Academy";

  // Dashboard customization state
  const [widgets, setWidgets] = React.useState<DashboardWidgetsState>({
    quickActions: true,
    kpis: true,
    analytics: true,
    branchComparison: true,
    notifications: true,
  });

  const [customizeOpen, setCustomizeOpen] = React.useState(false);
  const [selectedDateRange, setSelectedDateRange] = React.useState<
    "today" | "week" | "month" | "session"
  >("today");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Drilldown dialog state
  const [drilldownKpi, setDrilldownKpi] = React.useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Institutional indicators refreshed from ledger");
    }, 400);
  };

  const handleExportSummary = () => {
    toast.success("Executive health report generated (PDF ready)");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Operational Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE5F0] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">Home</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span>Overview dashboard</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-semibold text-[#2570D3]">{schoolName}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Overview dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Institutional overview, campus velocity, and administrative actions
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Selector */}
          <div className="inline-flex rounded-lg border border-[#DDE5F0] bg-white p-0.5 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setSelectedDateRange("today")}
              className={cn(
                "rounded-md px-2.5 py-1.5 font-medium transition-colors cursor-pointer",
                selectedDateRange === "today"
                  ? "bg-[#2570D3] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setSelectedDateRange("week")}
              className={cn(
                "rounded-md px-2.5 py-1.5 font-medium transition-colors cursor-pointer",
                selectedDateRange === "week"
                  ? "bg-[#2570D3] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              This week
            </button>
            <button
              type="button"
              onClick={() => setSelectedDateRange("month")}
              className={cn(
                "rounded-md px-2.5 py-1.5 font-medium transition-colors cursor-pointer",
                selectedDateRange === "month"
                  ? "bg-[#2570D3] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              This month
            </button>
            <button
              type="button"
              onClick={() => setSelectedDateRange("session")}
              className={cn(
                "rounded-md px-2.5 py-1.5 font-medium transition-colors cursor-pointer",
                selectedDateRange === "session"
                  ? "bg-[#2570D3] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Session 2026/27
            </button>
          </div>

          {/* Refresh */}
          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-lg border border-[#DDE5F0] bg-white p-2 text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            title="Refresh statistics"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin text-[#2570D3]")}
            />
          </button>

          {/* Export Report */}
          <button
            type="button"
            onClick={handleExportSummary}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE5F0] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Customize Layout */}
          <button
            type="button"
            onClick={() => setCustomizeOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE5F0] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Sliders className="h-3.5 w-3.5 text-[#2570D3]" />
            <span className="hidden sm:inline">Customize</span>
          </button>
        </div>
      </div>

      {/* Widget 1: Quick Actions Bar */}
      {widgets.quickActions && <QuickActionsBar />}

      {/* Widget 2: 5 KPI Summary Cards */}
      {widgets.kpis && <KpiSummaryCards onSelectKpi={setDrilldownKpi} />}

      {/* Widget 3: Visual Analytics (Attendance Trend & Fee Collections) */}
      {widgets.analytics && <AnalyticsCharts />}

      {/* Widget 4: Multi-Branch Comparison Table */}
      {widgets.branchComparison && (
        <BranchComparisonTable
          selectedBranchId={selectedBranchId}
          onSelectBranch={onSelectBranch}
        />
      )}

      {/* Widget 5: Exceptions & Activity Log */}
      {widgets.notifications && <NotificationsPanel />}

      {/* Customize Dashboard Modal */}
      <CustomizeDashboardModal
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        widgets={widgets}
        onUpdateWidgets={setWidgets}
      />

      {/* Drill-down Modal on KPI Click */}
      {drilldownKpi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-sm text-slate-900">
                Detailed ledger drill-down: {drilldownKpi.toUpperCase()}
              </h3>
              <button
                type="button"
                onClick={() => setDrilldownKpi(null)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="py-4 text-xs text-slate-600 space-y-2">
              <p>
                Showing real-time records filtered for current campus session.
              </p>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-700">Audit Status</span>
                  <span className="text-emerald-700 font-semibold">Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-700">Database node</span>
                  <span className="font-mono">postgres_master_cluster</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-700">Last ledger reconciliation</span>
                  <span>Today, 10:45 AM</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDrilldownKpi(null)}
                className="rounded-lg bg-[#2570D3] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#1C5BB0]"
              >
                Close detail view
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
