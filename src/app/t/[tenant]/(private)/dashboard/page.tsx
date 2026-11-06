"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { useCurrentUser, useHasPermission } from "@/store/session-store";
import { schoolPath } from "@/lib/tenant-slug";
import { useTenant } from "@/providers/tenant-provider";

export default function DashboardPage() {
  const user = useCurrentUser();
  const { tenant } = useTenant();
  const roles = user?.roles.map((r) => r.code).join(", ") ?? "";
  const canReadUsers = useHasPermission("user.read");

  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-8 py-4">
        <p className="text-sm font-medium">{tenant.name}</p>
        <div className="flex items-center gap-3">
          <span className="text-[12.5px] text-muted-foreground">
            {user?.email ?? user?.username}
            {roles && ` · ${roles}`}
          </span>
          <LogoutButton />
        </div>
      </header>
      <div className="grid gap-3 p-8">
        <p>School dashboard</p>
        {canReadUsers && (
          <Link
            href={schoolPath(tenant.slug, "/users")}
            className="w-fit rounded-xl border px-4 py-2 text-[13px] font-medium transition-colors hover:bg-muted"
          >
            Manage users
          </Link>
        )}
      </div>
    </main>
  );
}
