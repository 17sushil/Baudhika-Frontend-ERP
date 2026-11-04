"use client";

import { LogoutButton } from "@/components/auth/logout-button";
import { useCurrentUser } from "@/store/session-store";
import { useTenant } from "@/providers/tenant-provider";

export default function DashboardPage() {
  const user = useCurrentUser();
  const { tenant } = useTenant();
  const roles = user?.roles.map((r) => r.code).join(", ") ?? "";

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
      <div className="p-8">School dashboard</div>
    </main>
  );
}
