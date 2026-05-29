import type { MarkId } from "@/components/integration-marks";

export type SponsorKind = "ai" | "credits" | "service" | "infra";
export type PartnerRole = "compute" | "ai" | "search" | "infra" | "tooling" | "hiring";
export type SlotState = "filled" | "open";

export interface Sponsor {
  slug: string;
  name: string;
  kind: SponsorKind;
  tagline: string;
  url: string;
  /** Optional brand mark if we have one; otherwise wordmark is rendered. */
  mark?: MarkId;
  /** Short note we publish about the sponsorship — keeps things transparent. */
  note: string;
  since: string;
}

export interface Partner {
  slug: string;
  name: string;
  role: PartnerRole;
  valueExchange: string;
  url?: string;
  mark?: MarkId;
  since?: string;
  slotState: SlotState;
}

/**
 * "Powered by" credit-donating providers shown as a slim grayscale strip.
 * Keep this list small and honest — every entry must reflect a real
 * relationship before launch. Placeholders are deliberately generic.
 */
export const SPONSORS: Sponsor[] = [
  {
    slug: "anthropic-credits",
    name: "Anthropic",
    kind: "ai",
    tagline: "Claude API credits for registry validators",
    url: "https://anthropic.com",
    mark: "anthropic",
    note: "Donates API credits used by automated metadata validators.",
    since: "2025",
  },
  {
    slug: "openai-credits",
    name: "OpenAI",
    kind: "ai",
    tagline: "Model credits for cross-harness validators",
    url: "https://openai.com",
    mark: "openai",
    note: "Donates GPT credits used to cross-check harness adapters.",
    since: "2025",
  },
  {
    slug: "cloudflare",
    name: "Cloudflare",
    kind: "infra",
    tagline: "Edge hosting + CDN",
    url: "https://cloudflare.com",
    note: "Hosts the public registry and OG image renderer at the edge.",
    since: "2024",
  },
  {
    slug: "vercel",
    name: "Vercel",
    kind: "infra",
    tagline: "Preview environments",
    url: "https://vercel.com",
    note: "Sponsors preview deployments for contributors' branches.",
    since: "2025",
  },
  {
    slug: "raycast",
    name: "Raycast",
    kind: "service",
    tagline: "Featured extension distribution",
    url: "https://raycast.com",
    mark: "raycast",
    note: "Distributes the HeyClaude Raycast extension at no cost.",
    since: "2025",
  },
  {
    slug: "npm",
    name: "npm",
    kind: "service",
    tagline: "Package registry for @heyclaude/mcp",
    url: "https://npmjs.com",
    mark: "npm",
    note: "Hosts the @heyclaude/mcp package and adapter exports.",
    since: "2024",
  },
] as const;

/**
 * Featured ecosystem partners — fewer, deeper relationships. The remaining
 * slots are explicitly "open" so the UI can invite outreach without faking
 * placement. Real partners replace open slots before launch.
 */
export const PARTNERS: Partner[] = [
  {
    slug: "smithery",
    name: "Smithery",
    role: "infra",
    valueExchange: "Hosts the remote MCP endpoint for HeyClaude.",
    url: "https://smithery.ai",
    since: "2026-Q1",
    slotState: "filled",
  },
  {
    slug: "glama",
    name: "Glama",
    role: "search",
    valueExchange: "Cross-publishes HeyClaude MCP metadata to its directory.",
    url: "https://glama.ai",
    since: "2026-Q1",
    slotState: "filled",
  },
  {
    slug: "anthropic-partner",
    name: "Anthropic",
    role: "ai",
    valueExchange: "Reviews safety guidance for risk-bearing categories.",
    url: "https://anthropic.com",
    mark: "anthropic",
    since: "2025-Q4",
    slotState: "filled",
  },
  { slug: "open-compute", name: "Open slot", role: "compute", valueExchange: "Compute or GPU credits for validators.", slotState: "open" },
  { slug: "open-tooling", name: "Open slot", role: "tooling", valueExchange: "Developer tooling for contributors.", slotState: "open" },
  { slug: "open-hiring", name: "Open slot", role: "hiring", valueExchange: "Featured hiring partner placement.", slotState: "open" },
];

export const PARTNER_ROLE_LABEL: Record<PartnerRole, string> = {
  compute: "Compute",
  ai: "AI",
  search: "Search",
  infra: "Infra",
  tooling: "Tooling",
  hiring: "Hiring",
};
