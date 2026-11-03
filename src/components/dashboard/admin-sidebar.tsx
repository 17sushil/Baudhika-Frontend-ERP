"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  WalletCards,
  FileSpreadsheet,
  Users,
  MessageSquareText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  School,
  X,
  HelpCircle,
} from "lucide-react";
import { useOptionalTenant } from "@/providers/tenant-provider";
import { cn } from "cn";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_MODULES: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Students", href: "/students", icon: GraduationCap },
  { title: "Academics", href: "/academics", icon: BookOpen },
  { title: "Attendance", href: "/attendance", icon: CalendarCheck },
  { title: "Finance", href: "/finance", icon: WalletCards, badge: "Dues" },
  { title: "Examinations", href: "/examinations", icon: FileSpreadsheet },
  { title: "Staff", href: "/staff", icon: Users },
  { title: "Communication", href: "/communication", icon: MessageSquareText },
  { title: "Reports", href: "/reports", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const tenantCtx = useOptionalTenant();
  const schoolName = tenantCtx?.tenant?.name ?? "Baudhika School ERP";
  const schoolShort = tenantCtx?.tenant?.shortName ?? "ERP";

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") {
      return (
        pathname === "/dashboard" ||
        pathname.endsWith("/dashboard") ||
        pathname === "/"
      );
    }
    return pathname.includes(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar overlay"
          onClick={onCloseMobile}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onCloseMobile();
          }}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden cursor-pointer"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#12294D] text-white transition-all duration-200 ease-in-out border-r border-[#1C3C6D]",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-[#1C3C6D]/80">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 overflow-hidden"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2570D3] text-white font-semibold shadow-xs">
              <School className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate font-medium text-sm text-white">
                  {schoolName}
                </p>
                <p className="text-xs text-white/60">Administration</p>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 text-white/70 hover:text-white lg:hidden rounded-md hover:bg-[#1C3C6D]"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {!collapsed && (
            <p className="px-3 pb-2 text-[11px] font-medium tracking-wider text-white/50 uppercase">
              Core modules
            </p>
          )}

          {NAV_MODULES.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href);

            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={onCloseMobile}
                title={collapsed ? item.title : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[#2570D3] text-white shadow-xs"
                    : "text-white/80 hover:bg-[#1C3C6D] hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    active
                      ? "text-white"
                      : "text-white/70 group-hover:text-white"
                  )}
                />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.title}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      active
                        ? "bg-white text-[#2570D3]"
                        : "bg-[#E69A2E] text-white"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer info & collapse toggle */}
        <div className="border-t border-[#1C3C6D]/80 p-3">
          <div className="space-y-1">
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-white/70 hover:bg-[#1C3C6D] hover:text-white transition-colors",
                collapsed && "justify-center"
              )}
            >
              <HelpCircle className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Help & documentation</span>}
            </Link>

            {/* Collapse toggle (desktop only) */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className={cn(
                "hidden lg:flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-white/70 hover:bg-[#1C3C6D] hover:text-white transition-colors cursor-pointer",
                collapsed && "justify-center"
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  <span>Collapse navigation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
