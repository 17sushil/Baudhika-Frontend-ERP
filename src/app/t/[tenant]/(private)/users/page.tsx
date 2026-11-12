"use client";

import { UsersRound } from "lucide-react";
import { UsersTableView } from "@/components/users/users-table-view";
import { useHasPermission } from "@/store/session-store";

/**
 * School-plane user administration on Ritik's directory design, wired to the
 * real /users API. The gate names no permission codes: it tells a human who
 * this screen is for and who to ask.
 */
export default function UsersPage() {
  const canRead = useHasPermission("user.read");

  if (!canRead) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="max-w-md rounded-2xl border border-[#DDE5F0] bg-white p-8 text-center shadow-2xs">
          <UsersRound className="mx-auto h-8 w-8 text-slate-300" />
          <h1 className="mt-3 text-sm font-semibold text-slate-900">
            User administration is not part of your role
          </h1>
          <p className="mt-2 text-[13px] text-slate-500">
            This screen is for the people who create and manage logins for the
            school. If you believe you should see it, ask your administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-6 md:p-8">
      <UsersTableView />
    </main>
  );
}
