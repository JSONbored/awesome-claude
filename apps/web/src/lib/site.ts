import { categorySpec } from "@heyclaude/registry/category-spec";

import {
  buildCategoryDescriptions,
  buildCategoryLabels,
  buildCategoryQuickstarts,
  buildCategorySeoDescriptions,
  buildCategoryUsageHints,
  categoryAccentClasses,
  categorySpecCategories,
  publicCsvEnv,
  publicEnv,
  publicHttpUrl,
} from "@/lib/site-lib";

export {
  buildCategoryDescriptions,
  buildCategoryLabels,
  buildCategoryQuickstarts,
  buildCategorySeoDescriptions,
  buildCategoryUsageHints,
  categoryAccentClasses,
  publicCsvEnv,
  publicEnv,
  publicHttpUrl,
} from "@/lib/site-lib";

const categories = categorySpecCategories;

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
  umamiWebsiteId: publicEnv("VITE_UMAMI_WEBSITE_ID") || "b734c138-2949-4527-9160-7fe5d0e81121",
  umamiAllowedHosts: publicCsvEnv("VITE_UMAMI_ALLOWED_HOSTS", ["heyclau.de", "www.heyclau.de"]),
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

export const categoryLabels: Record<string, string> = buildCategoryLabels(categories);

export const categoryDescriptions: Record<string, string> = buildCategoryDescriptions(categories);

export const categorySeoDescriptions: Record<string, string> =
  buildCategorySeoDescriptions(categories);

export const categoryUsageHints: Record<string, string> = buildCategoryUsageHints(categories);

export const categoryQuickstarts: Record<string, string[]> = buildCategoryQuickstarts(categories);
