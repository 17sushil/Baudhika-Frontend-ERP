"use server";

import { cacheLife, cacheTag } from "next/cache";
import type { ApiEnvelope, PublicTenantConfig } from "@/lib/api/types";
import type { Tenant } from "@/types/tenant";

/**
 * Resolve a school from its slug. Server-only, called from the tenant layout.
 *
 * Cached by Next and tagged `tenant-<slug>` so that PUT /tenants/:id/branding
 * can revalidate it on demand (the backend calls FRONTEND_REVALIDATE_URL).
 * The endpoint itself sends Cache-Control: public, max-age=60,
 * stale-while-revalidate=300.
 */
export async function getTenant(slug: string): Promise<Tenant | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`tenant-${slug}`);

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
  const host = `${slug}.${rootDomain}`;
  const url = `${process.env.NEXT_PUBLIC_API_URL}/public/tenants/resolve?host=${encodeURIComponent(host)}`;

  const res = await fetch(url);

  // 404 = unknown host, reserved subdomain, or a school still provisioning/failed.
  // 400 = malformed host. Both mean "there is no portal here".
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Tenant lookup failed (${res.status})`);

  const { data } = (await res.json()) as ApiEnvelope<PublicTenantConfig>;

  // A suspended school returns a minimal body (slug, status, name only) so the
  // frontend can show "temporarily unavailable" - hence all the fallbacks.
  const name = data.name?.trim() || data.slug;

  return {
    slug: data.slug,
    status: data.status,
    name,
    shortName: data.shortName?.trim() || name,
    description: data.description ?? null,
    logoUrl: data.logoUrl ?? null,
    faviconUrl: data.faviconUrl ?? null,
    language: data.language || "en",
    theme: data.theme ?? null,
  };
}
