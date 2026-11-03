"use client";

import * as React from "react";
import {
  Menu,
  Search,
  Bell,
  Building2,
  ChevronDown,
  User,
  ShieldCheck,
  LogOut,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";
import { MOCK_BRANCHES_LIST } from "./dashboard-mock-data";
import { useOptionalTenant } from "@/providers/tenant-provider";
import { cn } from "cn";

interface AdminTopbarProps {
  onOpenMobileSidebar: () => void;
  selectedBranchId: string;
  onSelectBranch: (id: string) => void;
}

export function AdminTopbar({
  onOpenMobileSidebar,
  selectedBranchId,
  onSelectBranch,
}: AdminTopbarProps) {
  const tenantCtx = useOptionalTenant();
  const [branchMenuOpen, setBranchMenuOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const currentBranch =
    MOCK_BRANCHES_LIST.find((b) => b.id === selectedBranchId) ??
    MOCK_BRANCHES_LIST[0];

  // Cmd + K shortcut listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchDialogOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#DDE5F0] bg-white px-4 lg:px-6 shadow-2xs">
        {/* Left: Mobile hamburger & Branch switcher */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden cursor-pointer"
            aria-label="Open sidebar navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Branch / Campus selector dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setBranchMenuOpen((v) => !v);
                setNotificationsOpen(false);
                setProfileOpen(false);
              }}
              className="flex items-center gap-2 rounded-lg border border-[#DDE5F0] bg-slate-50/70 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Building2 className="h-4 w-4 text-[#2570D3] shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">
                {currentBranch.name}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {branchMenuOpen && (
              <>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Close branch selector menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setBranchMenuOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setBranchMenuOpen(false);
                  }}
                />
                <div className="absolute left-0 mt-2 z-50 w-72 rounded-xl border border-[#DDE5F0] bg-white p-2 shadow-lg animate-in fade-in zoom-in-95">
                  <p className="px-3 py-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    Select campus / branch
                  </p>
                  <div className="mt-1 space-y-1">
                    {MOCK_BRANCHES_LIST.map((branch) => {
                      const selected = branch.id === selectedBranchId;
                      return (
                        <button
                          key={branch.id}
                          type="button"
                          onClick={() => {
                            onSelectBranch(branch.id);
                            setBranchMenuOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left text-xs transition-colors cursor-pointer",
                            selected
                              ? "bg-[#2570D3]/10 text-[#2570D3] font-medium"
                              : "text-slate-700 hover:bg-slate-50"
                          )}
                        >
                          <Building2
                            className={cn(
                              "h-4 w-4 mt-0.5 shrink-0",
                              selected ? "text-[#2570D3]" : "text-slate-400"
                            )}
                          />
                          <div className="min-w-0">
                            <p className="truncate font-medium">{branch.name}</p>
                            <p className="text-[11px] text-slate-500">
                              {branch.city}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center: Global Search Bar (opens search dialog) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <button
            type="button"
            onClick={() => setSearchDialogOpen(true)}
            className="flex w-full items-center justify-between rounded-lg border border-[#DDE5F0] bg-slate-50/60 px-3.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100/80 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400" />
              <span>Search students, staff, receipts...</span>
            </span>
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-500 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions: Session, Alerts, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search trigger */}
          <button
            type="button"
            onClick={() => setSearchDialogOpen(true)}
            className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Search records"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Academic Session Tag */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-md bg-[#2570D3]/10 px-2.5 py-1 text-xs font-medium text-[#2570D3]">
            <Calendar className="h-3.5 w-3.5" />
            <span>2026/27 (2083 BS)</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen((v) => !v);
                setBranchMenuOpen(false);
                setProfileOpen(false);
              }}
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D64545] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D64545]" />
              </span>
            </button>

            {notificationsOpen && (
              <>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Close notifications menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setNotificationsOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setNotificationsOpen(false);
                  }}
                />
                <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96 rounded-xl border border-[#DDE5F0] bg-white p-3 shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <p className="font-medium text-xs text-slate-900">
                      Notifications & pending alerts
                    </p>
                    <span className="rounded-full bg-[#D64545]/10 px-2 py-0.5 text-[10px] font-semibold text-[#D64545]">
                      3 new
                    </span>
                  </div>
                  <div className="mt-2 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    <div className="py-2 flex items-start gap-2.5 text-xs">
                      <AlertTriangle className="h-4 w-4 text-[#D64545] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-800">
                          Grade 10 fee overdue notice
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          42 students have overdue installments.
                        </p>
                        <span className="text-[10px] text-slate-400">25m ago</span>
                      </div>
                    </div>
                    <div className="py-2 flex items-start gap-2.5 text-xs">
                      <AlertTriangle className="h-4 w-4 text-[#E69A2E] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-800">
                          Low attendance in Grade 8-B
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          Attendance fell to 81.4% today.
                        </p>
                        <span className="text-[10px] text-slate-400">1h ago</span>
                      </div>
                    </div>
                    <div className="py-2 flex items-start gap-2.5 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-[#1F9D6B] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-800">
                          5 Scholarship waivers ready
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          Awaiting executive sign-off.
                        </p>
                        <span className="text-[10px] text-slate-400">2h ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 text-center">
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs font-medium text-[#2570D3] hover:underline"
                    >
                      View all exceptions in panel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((v) => !v);
                setBranchMenuOpen(false);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="User profile menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#12294D] text-white font-medium text-xs shadow-2xs">
                KS
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-medium text-slate-800 leading-tight">
                  Kiran Sharma
                </p>
                <p className="text-[11px] text-slate-500">Super Administrator</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
            </button>

            {profileOpen && (
              <>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Close user profile menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setProfileOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setProfileOpen(false);
                  }}
                />
                <div className="absolute right-0 mt-2 z-50 w-56 rounded-xl border border-[#DDE5F0] bg-white p-2 shadow-xl">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-medium text-xs text-slate-900">
                      Kiran Sharma
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      admin@baudhika.edu.np
                    </p>
                  </div>
                  <div className="py-1">
                    <a
                      href="#profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>My profile</span>
                    </a>
                    <a
                      href="#security"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                      <span>Security & 2FA</span>
                    </a>
                  </div>
                  <div className="border-t border-slate-100 pt-1">
                    <a
                      href="/login"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs text-[#D64545] hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign out</span>
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Cmd + K Global Search Dialog */}
      {searchDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs">
          <div
            role="button"
            tabIndex={0}
            aria-label="Close search overlay"
            className="fixed inset-0 -z-10"
            onClick={() => setSearchDialogOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setSearchDialogOpen(false);
            }}
          />
          <div className="relative w-full max-w-xl rounded-2xl border border-[#DDE5F0] bg-white p-4 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search students by roll, staff ID, receipts, or notices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-hidden"
              />
              <button
                type="button"
                onClick={() => setSearchDialogOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Quick shortcuts
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSearchDialogOpen(false)}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 text-left text-slate-700 hover:bg-slate-50"
                >
                  <Building2 className="h-4 w-4 text-[#2570D3]" />
                  <div>
                    <p className="font-medium">Fee billing collection</p>
                    <p className="text-[10px] text-slate-400">Finance & dues</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSearchDialogOpen(false)}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 text-left text-slate-700 hover:bg-slate-50"
                >
                  <Calendar className="h-4 w-4 text-[#1F9D6B]" />
                  <div>
                    <p className="font-medium">Class attendance entry</p>
                    <p className="text-[10px] text-slate-400">Daily roster</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Press ESC to close</span>
              <span>Baudhika ERP Fast Search</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
