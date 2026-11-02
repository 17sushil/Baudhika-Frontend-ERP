"use server";

import { cacheLife, cacheTag } from "next/cache";
import type { Tenant } from "@/types/tenant";

export async function getTenant(slug: string): Promise<Tenant | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`tenant-${slug}`);

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
  const host = `${slug}.${rootDomain}`;
  const url = `${process.env.NEXT_PUBLIC_API_URL}/public/tenants/resolve?host=${encodeURIComponent(host)}`;
  const res = await fetch(url);
  console.log("[getTenant]", url, res.status);
  // if (res.status === 404) return null;
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Tenant lookup failed (${res.status})`);
  // return res.json();
  const raw: Tenant = await res.json();
  // @ts-ignore
  const data = raw?.data
  const name = data.name?.trim() || data.slug;
  return {
    ...data,
    name,
    shortName: data.shortName?.trim() || name,
    logoUrl: data.logoUrl || null,
    faviconUrl: data.faviconUrl || null,
    description: data.description || null,
    language: data.language || "en",
    theme: data.theme ?? null,
  };
}
