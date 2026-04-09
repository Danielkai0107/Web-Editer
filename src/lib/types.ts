export interface Profile {
  id: string;
  email: string;
  plan: "free" | "basic" | "pro";
  role: "user" | "admin";
  created_at: string;
}

export interface Site {
  id: string;
  user_id: string;
  name: string;
  subdomain: string;
  custom_domain: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  site_id: string;
  title: string;
  slug: string;
  content_json: Record<string, unknown>;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  name: string;
  category: "hero" | "feature" | "gallery" | "cta" | "footer" | "other";
  thumbnail_url: string | null;
  html: string;
  css: string;
  js: string;
  is_active: boolean;
  created_at: string;
}

export interface Deployment {
  id: string;
  site_id: string;
  vercel_url: string | null;
  preview_url: string | null;
  status: "pending" | "building" | "success" | "failed";
  error_log: string | null;
  created_at: string;
}

export const PLAN_LIMITS = {
  free: { pages: 1, customDomain: false, ai: false },
  basic: { pages: 3, customDomain: true, ai: false },
  pro: { pages: Infinity, customDomain: true, ai: true },
} as const;
