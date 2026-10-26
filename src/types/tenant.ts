export type Tenant = {
  slug: string;
  status: "active" | "suspended" | "inactive" | string;
  name: string;
  shortName: string;
  description?: string;
  logoUrl?: string;
  faviconUrl?: string;
  language?: string;
  theme?: {
    primary?: string;
    primaryForeground?: string;
    secondary?: string;
    secondaryForeground?: string;
  };
};