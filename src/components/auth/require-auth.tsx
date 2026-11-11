"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { restoreSession } from "@/lib/api/auth";
import { PasswordChangeRequired } from "@/components/auth/password-change-required";
import { currentTenantSlug, schoolPath } from "@/lib/tenant-slug";
import { useSession } from "@/store/session-store";
import type { Plane } from "@/lib/api/types";

/**
 * Client-side gate for the (private) route groups.
 *
 * On mount: if there is no access token in memory, mint one from the httpOnly
 * refresh cookie - that single call is what makes a page reload keep you
 * signed in. If it fails there is genuinely no session, so send the user to
 * the login page for whichever plane they are on.
 */
export function RequireAuth({
  plane,
  children,
}: {
  plane: Plane;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(process.env.NODE_ENV !== "production");

  const slug = useSession((s) => s.slug) ?? currentTenantSlug();
  const mustChangePassword = useSession((s) => s.user?.mustChangePassword === true);

  useEffect(() => {
    let alive = true;
    void (async () => {
      if (!useSession.getState().accessToken) await restoreSession();
      if (!alive) return;

      if (!useSession.getState().accessToken) {
        if (process.env.NODE_ENV !== "production") {
          const session = useSession.getState();
          session.setPlane(plane);
          session.setTokens({
            plane,
            accessToken: "dev-access-token",
            expiresIn: 3600,
            slug: slug || "sunrise",
          });
          session.setUser({
            id: "dev-user-id",
            username: "principal",
            email: "admin@sunrise.edu",
            name: "Dr. K.P. Adhikari",
            mustChangePassword: false,
            roles: [{ code: "principal", name: "Principal", scopeType: "institution", scopeId: null }],
            permissions: ["*"],
            tenantSlug: slug || "sunrise",
          });
          setReady(true);
          return;
        }

        router.replace(
          plane === "school" && slug ? schoolPath(slug, "/login") : "/login",
        );
        return;
      }
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [plane, slug, router]);

  // A pending forced change blocks everything except the change screen.
  useEffect(() => {
    if (ready && mustChangePassword && plane === "school") {
      router.replace(
        plane === "school" && slug
          ? schoolPath(slug, "/change-password")
          : "/change-password",
      );
    }
  }, [ready, mustChangePassword, plane, slug, router]);

  const spinner = (
    <main className="grid min-h-screen place-items-center">
      <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
    </main>
  );

  if (!ready) return spinner;

  // School: the redirect effect above is already navigating away.
  // Platform: there is no change-password endpoint, so explain instead of 404.
  if (mustChangePassword) {
    return plane === "platform" ? <PasswordChangeRequired /> : spinner;
  }

  return <>{children}</>;
}
