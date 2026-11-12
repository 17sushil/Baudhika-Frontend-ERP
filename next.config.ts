import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    // cacheComponents enables Next 16's instant-navigation validation, which
    // drops our client-component pages during its dev-time check and then
    // falls back to full reloads (tearing the in-memory session). Limit the
    // validation to segments that explicitly opt in via `export const instant`.
    instantInsights: {
      validationLevel: "manual-warning",
    },
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    const headers = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];

    // Production only: the dev overlay and HMR need eval + ws, which a strict
    // CSP would break. next-themes injects an inline script, so script-src
    // keeps 'unsafe-inline' until we ship per-request nonces; the CSP still
    // pins every external host and blocks exfiltration via connect-src.
    if (process.env.NODE_ENV === "production") {
      headers.push(
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains",
        },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'self'",
            "object-src 'none'",
            "script-src 'self' 'unsafe-inline' https://school-erp-chatbot.onrender.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https://images.unsplash.com",
            "connect-src 'self' https://school-erp-chatbot.onrender.com",
            "font-src 'self' data:",
          ].join("; "),
        },
      );
    }

    return [{ source: "/:path*", headers }];
  },
};

export default nextConfig;
