import * as React from "react";
import { DashboardLayoutShell } from "@/components/dashboard/dashboard-layout-shell";

export default function TenantPrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
}
