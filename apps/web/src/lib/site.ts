import { categorySpec } from "@heyclaude/registry/category-spec";

type CategorySpecEntry = {
  label: string;
  description: string;
  seoDescription?: string;
  usageHint: string;
  quickstart?: string[];
};

const categories = categorySpec.categories as Record<string, CategorySpecEntry>;

function publicEnv(name: string) {
  const viteValue = import.meta.env[name];
  if (typeof viteValue === "string" && viteValue.trim()) {
    return viteValue.trim();
  }

  if (typeof process !== "undefined") {
    const processValue = process.env?.[name];
    if (typeof processValue === "string" && processValue.trim()) {
      return processValue.trim();
    }
  }

  return "";
}

function publicHttpUrl(value: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

export const siteConfig = {
  name: "HeyClaude",
  shortName: "heyclaude",
  description:
    "An unofficial community-built awesome Claude directory for agents, MCP servers, tools, skills, rules, commands, hooks, guides, collections, and jobs.",
  url: "https://heyclau.de",
  githubUrl: "https://github.com/JSONbored/awesome-claude",
  jobsEmail: "jobs@heyclau.de",
  twitterUrl: publicEnv("NEXT_PUBLIC_TWITTER_URL") || "https://x.com/jsonbored",
  discordUrl: publicEnv("NEXT_PUBLIC_DISCORD_URL") || "https://discord.com/invite/Ax3Py4YDrq",
  // Served same-origin via the /u/script.js proxy (see routes/u.script[.]js.ts)
  // so the CSP needs no third-party script-src. umami auto-derives its collector
  // from the script directory (/u/api/send). The instance origin is configured
  // server-side as UMAMI_UPSTREAM_URL on the proxy routes.
  umamiScriptUrl: publicEnv("VITE_UMAMI_SCRIPT_URL") || "/u/script.js",
  umamiWebsiteId: publicEnv("VITE_UMAMI_WEBSITE_ID") || "b734c138-2949-4527-9160-7fe5d0e81121",
  // Empty string intentionally disables the private gate and shows manual PR instructions.
  submissionGateUrl: publicHttpUrl(
    publicEnv("VITE_SUBMISSION_GATE_URL") || publicEnv("NEXT_PUBLIC_SUBMISSION_GATE_URL"),
  ),
  submissionBaseRef:
    publicEnv("VITE_SUBMISSION_BASE_REF") || publicEnv("NEXT_PUBLIC_SUBMISSION_BASE_REF") || "main",
  polarFreeJobUrl: publicEnv("NEXT_PUBLIC_POLAR_FREE_JOB_URL") || "/jobs/post?tier=free",
  polarJobBoardUrl: publicEnv("NEXT_PUBLIC_POLAR_JOB_BOARD_URL") || "/advertise",
  polarFeaturedJobUrl: publicEnv("NEXT_PUBLIC_POLAR_FEATURED_JOB_URL") || "/advertise",
  polarSponsoredJobUrl: publicEnv("NEXT_PUBLIC_POLAR_SPONSORED_JOB_URL") || "/advertise",
  polarFeaturedJob90Url:
    publicEnv("NEXT_PUBLIC_POLAR_FEATURED_JOB_90_URL") || "/jobs/post?tier=featured",
  polarSponsoredJob90Url:
    publicEnv("NEXT_PUBLIC_POLAR_SPONSORED_JOB_90_URL") || "/jobs/post?tier=sponsored",
  nav: [
    { href: "/browse", label: "Browse" },
    { href: "/best/agent-workflow-starter-kits", label: "Best" },
    { href: "/brief", label: "Brief" },
    { href: "/tools", label: "Tools" },
    { href: "/jobs", label: "Jobs" },
    { href: "/about", label: "About" },
  ],
  categoryOrder: categorySpec.categoryOrder,
} as const;

export const categoryLabels: Record<string, string> = Object.fromEntries(
  Object.entries(categories).map(([category, spec]) => [category, spec.label]),
);

export const categoryDescriptions: Record<string, string> = Object.fromEntries(
  Object.entries(categories).map(([category, spec]) => [category, spec.description]),
);

export const categorySeoDescriptions: Record<string, string> = Object.fromEntries(
  Object.entries(categories).map(([category, spec]) => [
    category,
    spec.seoDescription ?? spec.description,
  ]),
);

export const categoryUsageHints: Record<string, string> = Object.fromEntries(
  Object.entries(categories).map(([category, spec]) => [category, spec.usageHint]),
);

export const categoryQuickstarts: Record<string, string[]> = Object.fromEntries(
  Object.entries(categories).map(([category, spec]) => [
    category,
    Array.isArray(spec.quickstart) ? spec.quickstart : [],
  ]),
);

export const categoryAccentClasses: Record<string, string> = {
  agents: "text-chart-1 border-border bg-secondary/30",
  mcp: "text-chart-2 border-border bg-secondary/30",
  tools: "text-primary border-border bg-secondary/30",
  skills: "text-chart-5 border-border bg-secondary/30",
  rules: "text-destructive border-border bg-secondary/30",
  commands: "text-primary border-border bg-secondary/30",
  hooks: "text-chart-4 border-border bg-secondary/30",
  guides: "text-chart-2 border-border bg-secondary/30",
  collections: "text-chart-3 border-border bg-secondary/30",
  statuslines: "text-chart-4 border-border bg-secondary/30",
};
