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
  try {
    const res = await fetch(url);
    console.log("[getTenant]", url, res.status);
    if (res.status === 404 || res.status === 400) {
      if (process.env.NODE_ENV !== "production" && slug.startsWith("demo")) {
        return {
          slug,
          name: slug === "demo2" ? "Demo Secondary School" : "Sunrise Public School",
          shortName: slug === "demo2" ? "DSS" : "Sunrise",
          status: "active",
          description: "School ERP Back-office Administration Portal",
          logoUrl: null,
          faviconUrl: null,
          language: "en",
          theme: null,
        };
      }
      return null;
    }
    if (!res.ok) throw new Error(`Tenant lookup failed (${res.status})`);
    const raw: any = await res.json();
    const data = raw?.data ?? raw;
    if (!data) return null;
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
  } catch (err) {
    console.warn(`[getTenant] Backend offline for ${slug}, using local fallback:`, err);
    return {
      slug,
      name: slug === "demo2" ? "Demo Secondary School" : "Baudhika Academy",
      shortName: slug === "demo2" ? "DSS" : "Baudhika",
      status: "active",
      description: "School ERP Back-office Administration Portal",
      logoUrl: null,
      faviconUrl: null,
      language: "en",
      theme: null,
    };
  }
}
