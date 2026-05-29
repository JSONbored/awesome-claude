import type { CommercialTool } from "@/types/registry";

export const COMMERCIAL_TOOLS: CommercialTool[] = [
  {
    slug: "linear",
    name: "Linear",
    tagline: "Issue tracking built for product teams that ship",
    description:
      "Linear's MCP and Claude Code integrations turn issues, projects, and cycles into first-class agent context.",
    websiteUrl: "https://linear.app",
    brandDomain: "linear.app",
    pricingModel: "freemium",
    disclosure: "editorial",
    category: "Project management",
    tags: ["issues", "roadmap", "mcp"],
    operatingSystem: ["macOS", "Windows", "Web"],
    dateAdded: "2026-04-21",
    featured: true,
  },
  {
    slug: "vercel",
    name: "Vercel",
    tagline: "The frontend cloud for AI-native teams",
    description: "Ship Claude-powered apps with first-class MCP and AI Gateway support.",
    websiteUrl: "https://vercel.com",
    brandDomain: "vercel.com",
    pricingModel: "freemium",
    disclosure: "heyclaude_pick",
    category: "Deployment",
    tags: ["deploy", "edge", "ai"],
    dateAdded: "2026-04-18",
  },
  {
    slug: "raycast-pro",
    name: "Raycast Pro",
    tagline: "AI commands and team workflows for macOS",
    description: "Hosts the official HeyClaude Raycast extension and adds AI commands across your desktop.",
    websiteUrl: "https://www.raycast.com/pro",
    brandDomain: "raycast.com",
    pricingModel: "subscription",
    disclosure: "affiliate",
    affiliateUrl: "https://www.raycast.com/pro?via=heyclaude",
    category: "Productivity",
    tags: ["launcher", "ai-commands"],
    dateAdded: "2026-04-12",
  },
  {
    slug: "polar",
    name: "Polar",
    tagline: "Billing built for developer-facing products",
    description: "Powers HeyClaude's job-posting tiers and lets indie teams ship paid Claude tools without Stripe glue.",
    websiteUrl: "https://polar.sh",
    brandDomain: "polar.sh",
    pricingModel: "usage-based",
    disclosure: "sponsored",
    category: "Billing",
    tags: ["billing", "payments"],
    dateAdded: "2026-04-05",
  },
];

export function getCommercialTool(slug: string) {
  return COMMERCIAL_TOOLS.find((t) => t.slug === slug);
}
