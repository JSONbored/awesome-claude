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
    slug: "cloudflare",
    name: "Cloudflare",
    kind: "infra",
    tagline: "Edge hosting + CDN",
    url: "https://cloudflare.com",
    note: "Hosts the public registry and OG image renderer at the edge.",
    since: "2024",
  },
  {
    slug: "npm-registry",
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
    slug: "open-ai",
    name: "Open slot",
    role: "ai",
    valueExchange: "Model or evaluation credits for registry validation.",
    slotState: "open",
  },
  {
    slug: "open-search",
    name: "Open slot",
    role: "search",
    valueExchange: "Search/discovery distribution for source-backed registry metadata.",
    slotState: "open",
  },
  {
    slug: "open-infra",
    name: "Open slot",
    role: "infra",
    valueExchange: "Infrastructure support for previews, analytics, or public APIs.",
    slotState: "open",
  },
  {
    slug: "open-compute",
    name: "Open slot",
    role: "compute",
    valueExchange: "Compute or GPU credits for maintainer review tooling.",
    slotState: "open",
  },
  {
    slug: "open-tooling",
    name: "Open slot",
    role: "tooling",
    valueExchange: "Developer tooling for contributors.",
    slotState: "open",
  },
  {
    slug: "open-hiring",
    name: "Open slot",
    role: "hiring",
    valueExchange: "Featured hiring partner placement.",
    slotState: "open",
  },
];

export const PARTNER_ROLE_LABEL: Record<PartnerRole, string> = {
  compute: "Compute",
  ai: "AI",
  search: "Search",
  infra: "Infra",
  tooling: "Tooling",
  hiring: "Hiring",
};
