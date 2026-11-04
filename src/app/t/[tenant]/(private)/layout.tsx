import { RequireAuth } from "@/components/auth/require-auth";

export default function TenantPrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth plane="school">{children}</RequireAuth>;
}
